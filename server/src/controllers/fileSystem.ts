import {
  NodeType,
  AvailableProperties,
  BaseNode,
  FileNode,
  FolderNode,
  SymbolicLinkNode,
} from '../models'
import { sanitizePath } from '../utils/path'

export type SystemNode = FileNode | FolderNode | SymbolicLinkNode

class FileSystem {
  root: FolderNode

  constructor(initialRoot?: FolderNode) {
    if (initialRoot) {
      this.root = initialRoot
    } else {
      this.root = {
        name: '', // root
        type: NodeType.Folder,
        properties: {hide: false, executable: false},
        children: {}
      }
    }
  }

  getNode(path: string): BaseNode | null {
    let currentNode: BaseNode | null = this.root

    // remove empty paths in case of duplicated/tailing slashes
    const parts = path.split('/').filter((part) => part !== '')
    for (const nextPart of parts) {
      switch (currentNode?.type) {
        case NodeType.Folder:
          currentNode = (<FolderNode>currentNode).children[nextPart] || null
          break

        case NodeType.SymbolicLink:          
          const targetPath = (<SymbolicLinkNode>currentNode).target

          // handling symbolic link loops
          if (targetPath && path.includes(targetPath)) {
            throw new Error(
              `Symbolic Link loop!
               Path: ${path}
               Symbolic Link: ${currentNode.name} => ${targetPath}`
            )
          }

          const targetNode = this.getNode(targetPath)
          if (targetNode?.type === NodeType.Folder) {
            currentNode = (<FolderNode>targetNode).children[nextPart] || null
          } else {
            currentNode = null
          }
          break

        case NodeType.File:
          throw new Error(
            `Trying to open a node (${nextPart}) from within a file: ${currentNode.name}`
          )

        default:
          currentNode = null
      }
    }

    // if final node is a symbolic link, replace it with the original
    if (currentNode?.type === NodeType.SymbolicLink) {
      currentNode = this.getNode((<SymbolicLinkNode>currentNode).target)
    }

    return currentNode
  }

  private getNodeName(path: string): string {
    const nodeName = path.split('/').filter((part) => part !== '').pop()
    if (!nodeName) {
      throw new Error(`Invalid name: ${nodeName}`)
    }
    return nodeName
  }

  private getParentNodePath(path: string): string {
    const parts = path.split('/').filter((part) => part !== '')
    parts.pop()

    return parts.join('/')
  }

  private getParentNode(path: string): FolderNode {
    const parentPath = this.getParentNodePath(path)

    const parentNode = parentPath === '' ? this.root : this.getNode(parentPath)
    if (!parentNode) {
      throw new Error(`Parent directory "${parentPath}" not found`)
    }
    if (parentNode.type !== NodeType.Folder) {
      throw new Error(`Path "${parentPath}" is not a directory`)
    }

    return <FolderNode>parentNode
  }

  private linkNodeToParent(parent: BaseNode, node: SystemNode) {
    if (parent.type !== NodeType.Folder) {
      throw new Error('Can only add files or directories inside a directory')
    }

    const folder = (<FolderNode>parent)
    if (folder.children[node.name] !== undefined) {
      throw new Error(`Duplicated file name inside "${folder.name}" directory: ${node.name}`)
    }

    folder.children[node.name] = node
  }

  private createNode(path: string, node: SystemNode) {
    const parentNode = this.getParentNode(path)

    // make sure node has the same name as given in the path
    const nodeNameFromPath = this.getNodeName(path)
    node.name = nodeNameFromPath

    this.linkNodeToParent(parentNode, node)
  }

  addFile(path: string) {
    const safePath = sanitizePath(path)
    const newFile: FileNode = {
      name: '', // depends on path
      type: NodeType.File,
      properties: {hide: false, executable: false}
    }
    this.createNode(safePath, newFile)
  }

  addDirectory(path: string) {
    const safePath = sanitizePath(path)
    const newDirectory: FolderNode = {
      name: '', // depends on path
      type: NodeType.Folder,
      properties: {hide: false, executable: false},
      children: {}
    }
    this.createNode(safePath, newDirectory)
  }

  addSymbolicLink(path: string, target: string) {
    const safePath = sanitizePath(path)

    // TODO verify symlink loop

    const newLink: SymbolicLinkNode = {
      name: '', // depends on path
      type: NodeType.SymbolicLink,
      target
    }
    this.createNode(safePath, newLink)
  }

  deleteNode(path: string) {
    const parentNode = this.getParentNode(path)
    const nodeName = this.getNodeName(path)

    if (!parentNode.children[nodeName]) {
      throw new Error(`Deletion failed, path not found: ${path}`)
    }
    delete parentNode.children[nodeName]
  }

  moveNode(path: string, destinationPath: string) {
    const nodeName = this.getNodeName(path)
    const parentNode = this.getParentNode(path)

    const node = parentNode.children[nodeName]
    if (!node) {
      throw new Error(`Moving failed, source not found: ${path}`)
    }

    // TODO verify symlink loop

    const newParent = this.getNode(destinationPath)
    if (!newParent || newParent?.type !== NodeType.Folder) {
      throw new Error(`Destination is not a folder or was not found: ${destinationPath}`)
    }
    const destFolder = <FolderNode>newParent

    // transfer object reference from old parent to new
    delete parentNode.children[nodeName]
    destFolder.children[nodeName] = node
  }

  private recursivePropertyChange(node: BaseNode, property: string, value: boolean) {
    if (node.type === NodeType.File) {
      const file = <FileNode>node
      file.properties[property] = value
    }

    if (node.type === NodeType.Folder) {
      const folder = <FolderNode>node
      folder.properties[property] = value

      // update children's property recursively
      for (const [_, child] of Object.entries(folder.children)) {
        this.recursivePropertyChange(child, property, value)
      }
    }
  }

  toggleNodeProperties(path: string, property: string) {
    if (!AvailableProperties.includes(property)) {
       throw new Error(`Property does not exist: ${property}`)
    }

    const node = this.getNode(path)
    if (!node) {
      throw new Error(`Not found: ${path}`)
    }

    // ignore SymbolicLinks since it has no properties of its own
    if (node.type === NodeType.File || node.type === NodeType.Folder) {
      const fileOrFolder = <FileNode | FolderNode>node
      const newValue = !fileOrFolder.properties[property]
      this.recursivePropertyChange(node, property, newValue)
    }
  }
}

export default FileSystem

import { v4 } from 'uuid'
import {
  NodeType,
  AvailableProperties,
  BaseNode,
  FileNode,
  FolderNode,
  SymbolicLinkNode,
} from '../models'
import { sanitizePath, trimSlashes } from '../utils/path'

export type SystemNode = FileNode | FolderNode | SymbolicLinkNode

class FileSystem {
  root: FolderNode

  constructor(initialRoot?: FolderNode) {
    if (initialRoot) {
      this.root = initialRoot
    } else {
      this.root = {
        id: v4(),
        name: '', // root
        fullPath: '',
        type: NodeType.Folder,
        properties: {
          hidden: false,
          executable: false,
          readOnly: false,
        },
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
    const safePath = trimSlashes(sanitizePath(path))
    const parentNode = this.getParentNode(safePath)

    // make sure node has the same name as given in the path
    // save a reference to the full path of the node to facilitate
    // future operations
    const nodeNameFromPath = this.getNodeName(safePath)
    node.name = nodeNameFromPath
    node.fullPath = safePath

    this.linkNodeToParent(parentNode, node)
  }

  addFile(path: string) {
    const newFile: FileNode = {
      id: v4(),
      name: '', // depends on path
      fullPath: '', // will be set later
      type: NodeType.File,
      properties: {
        hidden: false,
        executable: false,
        readOnly: false,
      }
    }
    this.createNode(path, newFile)
  }

  addDirectory(path: string) {
    const newDirectory: FolderNode = {
      id: v4(),
      name: '', // depends on path
      fullPath: '', // will be set later
      type: NodeType.Folder,
      properties: {
        hidden: false,
        executable: false,
        readOnly: false,
      },
      children: {}
    }
    this.createNode(path, newDirectory)
  }

  addSymbolicLink(path: string, target: string) {
    const newLink: SymbolicLinkNode = {
      id: v4(),
      name: '', // depends on path
      fullPath: '', // will be set later
      type: NodeType.SymbolicLink,
      target
    }
    this.createNode(path, newLink)
  }

  deleteNode(path: string) {
    const parentNode = this.getParentNode(path)
    const nodeName = this.getNodeName(path)

    if (!parentNode.children[nodeName]) {
      throw new Error(`Deletion failed, path not found: ${path}`)
    }
    delete parentNode.children[nodeName]
  }

  private recurviseFullPathUpdate(node: BaseNode, newBasePath: string) {
    const newPath = `${trimSlashes(newBasePath)}/${trimSlashes(node.name)}`
    node.fullPath = newPath

    const childNodes = (<FolderNode>node).children
    if (childNodes !== undefined) {
      for (const [_, child] of Object.entries(childNodes)) {
        this.recurviseFullPathUpdate(child, newPath)
      }
    }
  }

  moveNode(path: string, destinationPath: string) {
    const nodeName = this.getNodeName(path)
    const parentNode = this.getParentNode(path)

    const node = parentNode.children[nodeName]
    if (!node) {
      throw new Error(`Moving failed, source not found: ${path}`)
    }

    const newParent = this.getNode(destinationPath)
    if (!newParent || newParent?.type !== NodeType.Folder) {
      throw new Error(`Destination is not a folder or was not found: ${destinationPath}`)
    }
    const destFolder = <FolderNode>newParent

    // make sure to remove the reference form old parent
    delete parentNode.children[nodeName]

    // update path and transfer to new parent
    node.fullPath = `${trimSlashes(destinationPath)}/${trimSlashes(nodeName)}`
    destFolder.children[nodeName] = node

    // recursively update fullPath of children
    const childNodes = (<FolderNode>node).children
    if (childNodes !== undefined) {
      for (const [_, child] of Object.entries(childNodes)) {
        this.recurviseFullPathUpdate(child, node.fullPath)
      }
    }
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

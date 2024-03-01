import {
  NodeType,
  BaseNode,
  FileNode,
  FolderNode,
  SymbolicLinkNode,
} from '../models'

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
    const errors: Array<Error> = []

    // remove empty paths in case of duplicated/tailing slashes
    const parts = path.split('/').filter((part) => part !== '')
    parts.forEach((nextPart) => {
      switch (currentNode?.type) {
        case NodeType.Folder:
          currentNode = (<FolderNode>currentNode).children[nextPart] || null
          break

        case NodeType.SymbolicLink:          
          const targetPath = (<SymbolicLinkNode>currentNode).target

          // handling symbolic link loops
          if (targetPath && path.includes(targetPath)) {
            errors.push(new Error(
              `Symbolic Link loop!
               Path: ${path}
               Symbolic Link: ${currentNode.name} => ${targetPath}
              `
            ))
            currentNode = null
          }

          const targetNode = this.getNode(targetPath)
          if (targetNode?.type === NodeType.Folder) {
            currentNode = (<FolderNode>targetNode).children[nextPart] || null
          } else {
            currentNode = null
          }
          break

        // handle when trying to open a file or invalid node type
        case NodeType.File:
          errors.push(new Error(
            `Trying to open a node (${nextPart}) from within a file: ${currentNode.name}`
          ))
        default:
          currentNode = null
      }
    })

    if (errors.length > 0) {
      throw new Error(errors.join('\n\n'))
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
    const newFile: FileNode = {
      name: '', // depends on path
      type: NodeType.File,
      properties: {hide: false, executable: false}
    }
    this.createNode(path, newFile)
  }

  addDirectory(path: string) {
    const newDirectory: FolderNode = {
      name: '', // depends on path
      type: NodeType.Folder,
      properties: {hide: false, executable: false},
      children: {}
    }
    this.createNode(path, newDirectory)
  }

  addSymbolicLink(path: string, target: string) {
    const newLink: SymbolicLinkNode = {
      name: '', // depends on path
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

  moveNode(path: string, destinationPath: string) {
    const nodeName = this.getNodeName(path)
    const parentNode = this.getParentNode(path)

    const node = parentNode.children[nodeName]
    if (!node) {
      throw new Error(`Moving failed, source not found: ${path}`)
    }

    const newName = this.getNodeName(destinationPath)
    const newParent = this.getParentNode(destinationPath)

    // remove previous object reference
    delete parentNode.children[nodeName]
    
    // update name and move to new path
    node.name = newName
    newParent.children[newName] = node
  }

  changeNodeProperties(path: string, property: string) {
    // TODO toggle the property
  }
}

export default FileSystem

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
        name: 'root',
        type: NodeType.Folder,
        properties: {
          hide: false,
          executable: false,
        },
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

  private getNodeNameAndPath(path: string): {nodeName: string, parentPath: string} {
    const parts = path.split('/').filter((part) => part !== '')

    const nodeName = parts.pop()
    if (!nodeName) {
      throw new Error(`Invalid name: ${nodeName}`)
    }
    const parentPath = parts.join('/')

    return {nodeName, parentPath}
  }

  private linkNodeToParent(parent: BaseNode, node: SystemNode) {
    if (parent.type !== NodeType.Folder) {
      throw new Error('Can only add files or directories inside a directory')
    }

    const folder = (<FolderNode>parent)
    folder.children[node.name] = node
  }

  private addNode(path: string, node: SystemNode) {
    const {nodeName, parentPath} = this.getNodeNameAndPath(path)

    const parentNode = parentPath === '' ? this.root : this.getNode(parentPath)
    if (parentNode) {
      // make sure node has the same name as given in the path
      node.name = nodeName
      this.linkNodeToParent(parentNode, node)
    } else {
      throw new Error(`Parent directory "${parentPath}" not found`)
    }
  }

  addFile(path: string) {
    const newFile: FileNode = {
      name: '', // depends on path
      type: NodeType.File,
      properties: {hide: false, executable: false}
    }
    this.addNode(path, newFile)
  }

  addDirectory(path: string) {
    const newDirectory: FolderNode = {
      name: '', // depends on path
      type: NodeType.Folder,
      properties: {hide: false, executable: false},
      children: {}
    }
    this.addNode(path, newDirectory)
  }

  addSymbolicLink(path: string, target: string) {
    const newLink: SymbolicLinkNode = {
      name: '', // depends on path
      type: NodeType.SymbolicLink,
      target
    }
    this.addNode(path, newLink)
  }

}

export default FileSystem

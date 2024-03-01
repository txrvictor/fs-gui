import SymbolicLinkNode from "../models/SymbolicLinkNode"
import FolderNode from "../models/folderNode"
import { BaseNode, NodeType } from "../models/node"

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

  addFile(path: string) {
    const parts = path.split('/')
    const fileName = parts.pop()

    // TODO
  }

}

export default FileSystem

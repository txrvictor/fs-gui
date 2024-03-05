import FileSystem from "../controllers/fileSystem"
import {
  NodeType,
  BaseNode,
  FolderNode,
  FileNode,
  SymbolicLinkNode,
} from '../models'

function printTab(n: number) {
  process.stdout.write(' '.repeat(n * 2))
}

function getProperties(n: FileNode | FolderNode): string {
  // get only properties which are flagged true
  const props = Object.keys(n.properties).filter((p) => n.properties[p])
  return props.length > 0 ? `[${props.join(', ')}]` : ''
}

/**
 * Class used to print a fs tree on the terminal.
 */
class SystemHierarchyPrinter {
  fs: FileSystem

  constructor(fs: FileSystem) {
    this.fs = fs
  }

  printNodeHierarchy(node: BaseNode | null, indent = 0, displayName = node?.name, accPath = '') {
    if (!node) {
      return
    }
  
    switch (node.type) {
      case NodeType.Folder:
        const folder = <FolderNode>node
        
        printTab(indent)
        console.log(`${displayName}/ ${getProperties(folder)}`)

        // accumulate path to check loops later
        accPath += node.id
  
        Object.keys(folder.children).forEach((child) => {
          // add indent for folder's children
          this.printNodeHierarchy(folder.children[child], indent + 1, undefined, accPath)
        })
        break
  
      case NodeType.SymbolicLink:
        const link = <SymbolicLinkNode>node
  
        try {
          const linkDisplayName = `*${link.name}`
          const realTarget = this.fs.getNode(link.target)
          if (realTarget) {

            // check for symlink loops
            if (accPath.includes(realTarget.id)) {
              throw new Error(`Symlink loop: ${link.name} -> ${link.target}`)
            }

            this.printNodeHierarchy(realTarget, indent, linkDisplayName, accPath)
          } else {
            throw new Error(`Broken symlink: ${link.name} -> ${link.target}`)
          }
        } catch (e: any) {
          // fallback to print the symbolic link name
          printTab(indent)
          console.log(`*${displayName}[!${e.message}]`)
        }
        break
  
      case NodeType.File:
        const file = <FileNode>node
  
        printTab(indent)
        console.log(`- ${displayName} ${getProperties(file)}`)
        break
    }
  }
}

export default SystemHierarchyPrinter

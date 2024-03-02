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

class SystemHierarchyPrinter {
  fs: FileSystem

  constructor(fs: FileSystem) {
    this.fs = fs
  }

  printNodeHierarchy(node: BaseNode | null, indent = 0, displayName = node?.name) {
    if (!node) {
      return
    }
  
    switch (node.type) {
      case NodeType.Folder:
        const folder = <FolderNode>node
        
        printTab(indent)
        console.log(`${displayName}/ ${getProperties(folder)}`)
  
        Object.keys(folder.children).forEach((child) => {
          // add indent for folder's children
          this.printNodeHierarchy(folder.children[child], indent + 1)
        })
        break
  
      case NodeType.SymbolicLink:
        const link = <SymbolicLinkNode>node
  
        try {
          const linkDisplayName = `*${link.name}`
          const realTarget = this.fs.getNode(link.target)
          if (realTarget) {
            this.printNodeHierarchy(realTarget, indent, linkDisplayName)
          } else {
            throw new Error(`Broken symlink: ${link.name} -> ${link.target}`)
          }
        } catch (e) {
          // fallback to print the symbolic link name
          printTab(indent)
          console.log(`*${displayName}[!]`)
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

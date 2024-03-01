import FileSystem from "../controllers/fileSystem"
import SymbolicLinkNode from "../models/SymbolicLinkNode"
import FileNode from "../models/fileNode"
import FolderNode from "../models/folderNode"
import { BaseNode, NodeType } from "../models/node"

function printTab(n: number) {
  process.stdout.write(' '.repeat(n * 2))
}

function getProperties(n: FileNode | FolderNode): string {
  // get only properties which are flagged true
  const props = Object.keys(n.properties).filter((p) => n.properties[p])
  return props.length > 0 ? `[${props.join(', ')}]` : ''
}

export default function printNodeHierarchy(node: BaseNode | null, fs: FileSystem, indent = 0) {
  if (!node) {
    return
  }

  switch (node.type) {
    case NodeType.Folder:
      const folder = <FolderNode>node
      
      printTab(indent)
      console.log(`/${node.name} ${getProperties(folder)}`)

      Object.keys(folder.children).forEach((child) => {
        // add indent for folder's children
        printNodeHierarchy(folder.children[child], fs, indent + 1)
      })
      break

    case NodeType.SymbolicLink:
      const link = <SymbolicLinkNode>node
      try {
        const realTarget = fs.getNode(link.target)
        printNodeHierarchy(realTarget, fs, indent)
      } catch (e) {
        // fallback to print the symbolic link name
        printTab(indent)
        console.log(`* ${node.name}`)
      }
      break

    case NodeType.File:
      const file = <FileNode>node

      printTab(indent)
      console.log(`- ${file.name} ${getProperties(file)}`)
      break
  }
}

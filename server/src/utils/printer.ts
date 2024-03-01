import FileSystem from "../controllers/fileSystem"
import SymbolicLinkNode from "../models/SymbolicLinkNode"
import FolderNode from "../models/folderNode"
import { BaseNode, NodeType } from "../models/node"

function printTab(n: number) {
  process.stdout.write(' '.repeat(n * 2))
}

export default function printNodeHierarchy(node: BaseNode, fs: FileSystem, indent = 0) {
  switch (node.type) {
    case NodeType.Folder:
      printTab(indent)
      console.log(`/${node.name}`)

      const folder = <FolderNode>node
      Object.keys(folder.children).forEach((child) => {
        // add tabs recursively
        printNodeHierarchy(folder.children[child], fs, indent + 1)
      })
      break

    case NodeType.SymbolicLink:
      const link = <SymbolicLinkNode>node
      try {
        const realTarget = fs.getNode(link.target)
        if (realTarget) {
          printNodeHierarchy(realTarget, fs, indent)
        }
      } catch (e) {
        // fallback to print the link name
        printTab(indent)
        console.log(`* ${node.name}`)
      }
      break

    case NodeType.File:
      printTab(indent)
      console.log(`- ${node.name}`)
      break
  }
}

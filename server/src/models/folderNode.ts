import { BaseNode, NodeProperties, NodeType } from "./node"
import FileNode from "./fileNode"
import SymbolicLinkNode from "./SymbolicLinkNode"

interface FolderNode extends BaseNode {
  type: NodeType.Folder
  properties: NodeProperties
  children: {[name: string]: FileNode | SymbolicLinkNode | FolderNode}
}

export default FolderNode

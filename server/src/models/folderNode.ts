import { BaseNode, NodeProperties, NodeType } from "./node"
import FileNode from "./fileNode"
import SymbolicLinkNode from "./SymbolicLinkNode"

interface FolderNode extends BaseNode {
  type: NodeType.Folder
  properties: NodeProperties
  // structure the hierarchy using Object's key:value
  // instead of a more traditional list or tree approach
  children: {[name: string]: FileNode | SymbolicLinkNode | FolderNode}
}

export default FolderNode

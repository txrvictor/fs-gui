import { BaseNode, NodeType } from "./node"

interface SymbolicLinkNode extends BaseNode {
  type: NodeType.SymbolicLink
  target: string
}

export default SymbolicLinkNode

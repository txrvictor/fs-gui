import { BaseNode, NodeProperties, NodeType } from "./node"

interface FileNode extends BaseNode {
  type: NodeType.File
  properties: NodeProperties
}

export default FileNode

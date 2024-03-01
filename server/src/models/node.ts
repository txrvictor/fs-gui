
export enum NodeType {
  Folder = "folder",
  File = "file",
  SymbolicLink = "symbolicLink",
}

// minimal example for available properties
export interface NodeProperties {
  hide: boolean
  executable: boolean
}

export interface BaseNode {
  name: string
  type: NodeType
}

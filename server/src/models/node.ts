
export enum NodeType {
  Folder = "folder",
  File = "file",
  SymbolicLink = "symbolicLink",
}

// minimal example of available properties for simplicity
export const AvailableProperties = ['hide', 'executable']
type PropertyKeys = (typeof AvailableProperties)[number]

export type NodeProperties = {
  [key in PropertyKeys]: boolean
}

export interface BaseNode {
  name: string
  type: NodeType
}

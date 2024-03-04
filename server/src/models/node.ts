
export enum NodeType {
  Folder = "folder",
  File = "file",
  SymbolicLink = "symbolicLink",
}

// minimal example of available properties for simplicity
export const AvailableProperties = ['hidden', 'executable', 'readOnly']
type PropertyKeys = (typeof AvailableProperties)[number]

export type NodeProperties = {
  [key in PropertyKeys]: boolean
}

export interface BaseNode {
  id: string
  name: string
  type: NodeType
  fullPath: string
}

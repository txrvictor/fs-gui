
export type NodeType = 'file' | 'folder' | 'symbolicLink'

export interface NodeElement {
  name: string
  type: NodeType
  target?: string
  properties?: {
    hide: boolean
    executable: boolean
  }
  children?: {
    [name: string]: NodeElement
  }
}

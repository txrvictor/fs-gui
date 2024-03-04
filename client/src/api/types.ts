
export type NodeType = 'file' | 'folder' | 'symbolicLink'

export interface NodeElement {
  id: string
  name: string
  type: NodeType
  fullPath: string
  properties?: {
    [key: string]: boolean
  }
  children?: {
    [name: string]: NodeElement
  }
  target?: string

  // client side injected prop to ref target easily
  targetRef?: NodeElement
}


export type NodeType = 'file' | 'folder' | 'symbolicLink'

export interface NodeElement {
  id: string
  name: string
  type: NodeType
  properties?: {
    hide: boolean
    executable: boolean
  }
  children?: {
    [name: string]: NodeElement
  }
  target?: string

  // client side injected prop to ref target easily
  targetRef?: NodeElement
}

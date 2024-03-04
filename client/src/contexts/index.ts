import { createContext } from 'react'
import { NodeElement } from '../api/types'

interface ISelectedNodeContext {
  selectedNode: NodeElement | undefined
  setSelectedNode: (newNode: NodeElement) => void
}

export const SelectedNodeContext = createContext<ISelectedNodeContext>({
  selectedNode: undefined,
  setSelectedNode: () => {},
})

interface IRootNodeContext {
  root: NodeElement | undefined
  setRoot: (newRoot: NodeElement) => void
  flatRoot: Array<NodeElement>
}

export const RootNodeContext = createContext<IRootNodeContext>({
  root: undefined,
  setRoot: () => {},
  flatRoot: [],
})

export type ActionType = 'add-file' | 'add-folder' | 'add-link' | 'move' | 'delete'

interface IActionContext {
  action: ActionType | undefined
  setAction: (action: ActionType | undefined) => void
}

export const ActionContext = createContext<IActionContext>({
  action: undefined,
  setAction: () => {},
})

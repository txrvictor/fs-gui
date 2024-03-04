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

interface IRootNodeContextt {
  root: NodeElement | undefined
  setRoot: (newRoot: NodeElement) => void
}

export const RootNodeContext = createContext<IRootNodeContextt>({
  root: undefined,
  setRoot: () => {},
})

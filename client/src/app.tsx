import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

import { 
  RootNodeContext,
  SelectedNodeContext,
  ActionContext,
  ActionType,
} from './contexts'
import { getRoot } from './api'
import { NodeElement } from './api/types'

import DirectoryTree from './containers/directory-tree'
import NodeInfo from './containers/node-info'
import ActionsControl from './containers/actions-control'
import { flattenNodes } from './utils/node'


function App() {
  const [root, setRoot] = useState<NodeElement>()
  const [flatRoot, setFlatRoot] = useState<Array<NodeElement>>([])
  const [selectedNode, setSelectedNode] = useState<NodeElement>()
  const [action, setAction] = useState<ActionType>()

  const loadRoot = useCallback(async () => {
    try {
      const response = await getRoot()

     setRoot(response)
     setSelectedNode(response)
    } catch (err) {
      console.error(err)
      alert('Failed to load structure')
    }
  }, [])

  useEffect(() => {
    loadRoot()
  }, [loadRoot])

  useEffect(() => {
    // compute a flat array of all root elements
    if (root) {
      setFlatRoot(flattenNodes(root))
    } else {
      setFlatRoot([])
    }
  }, [root])

  useEffect(() => {
    // reset action when selected node change
    setAction(undefined)
  }, [selectedNode])

  return (
    <RootNodeContext.Provider value={{root, setRoot, flatRoot}}>
      <SelectedNodeContext.Provider value={{selectedNode, setSelectedNode}}>
        <ActionContext.Provider value={{action, setAction}}>

          <TitleContainer>
            <h1>FS GUI</h1>
          </TitleContainer>

          <Content>
            <DirectoryTree />

            <RightSideContainer>
              <NodeInfo />                
              <ActionsControl />
            </RightSideContainer>
          </Content>

        </ActionContext.Provider>
      </SelectedNodeContext.Provider>
    </RootNodeContext.Provider>
  )
}

export default App

const TitleContainer = styled.div`
  min-width: 780px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`

const Content = styled.div`
  display: flex;
  min-width: 780px;
  width: 80vw;
  
  > div + div {
    margin-left: 24px;
  }
`

const RightSideContainer = styled.div`
  min-height: 750px;
  flex: 1;
`

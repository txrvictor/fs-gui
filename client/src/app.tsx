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


function App() {
  const [root, setRoot] = useState<NodeElement>()
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
    // reset action when selected node change
    setAction(undefined)
  }, [selectedNode])

  return (
    <RootNodeContext.Provider value={{root, setRoot}}>
      <SelectedNodeContext.Provider value={{selectedNode, setSelectedNode}}>
          <TitleContainer>
            <h1>FS GUI</h1>

            <ButtonsContainer>
              <button onClick={() => {}}>
                Save
              </button>
              <button onClick={loadRoot}>
                Reload
              </button>
              <button onClick={() =>{}}>
                Clean
              </button>
            </ButtonsContainer>
          </TitleContainer>

          <Content>
            <DirectoryTree />

            <ActionContext.Provider value={{action, setAction}}>
              <RightSideContainer>
                <NodeInfo />                
                <ActionsControl />
              </RightSideContainer>
            </ActionContext.Provider>
          </Content>
      </SelectedNodeContext.Provider>
    </RootNodeContext.Provider>
  )
}

const TitleContainer = styled.div`
  min-width: 780px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  > button {
    min-width: 95px;
  }

  button + button {
    margin-left: 6px;
  }
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
  flex: 1;
`

export default App

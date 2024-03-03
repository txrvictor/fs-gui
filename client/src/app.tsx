import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

import { RootNodeContext, SelectedNodeContext } from './contexts'
import { getRoot } from './api'
import { NodeElement } from './api/types'

import DirectoryTree from './containers/directory-tree'
import NodeInfo from './containers/node-info'


function App() {
  const [root, setRoot] = useState<NodeElement>()
  const [selectedNode, setSelectedNode] = useState<NodeElement>()

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

  return (
    <RootNodeContext.Provider value={root}>
      <SelectedNodeContext.Provider value={{selectedNode, setSelectedNode}}>
        <TitleContainer>
          <h1>FS GUI</h1>

          <ButtonsContainer>
            <button onClick={() => {}}>
              Save
            </button>
            <button onClick={loadRoot}>
              Reload Root
            </button>
            <button onClick={() =>{}}>
              Clean
            </button>
          </ButtonsContainer>
        </TitleContainer>

        <Content>
          <DirectoryTree />
          <NodeInfo />
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



export default App

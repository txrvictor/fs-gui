import { useContext } from 'react'
import styled from 'styled-components'

import { SelectedNodeContext } from '../contexts'
import Panel from '../components/panel'


const NodeInfo = () => {
  const {selectedNode} = useContext(SelectedNodeContext)

  return (
    <Container>
      <Name>
        {selectedNode?.name || 'Main Directory'}
      </Name>
    </Container>
  )
}

export default NodeInfo

const Container = styled(Panel)`
  flex: 1;
  min-height: 400px;
  height: 40vh;
  overflow: auto;
`

const Name = styled.p`
  font-size: 1.5em;
  font-weight: bold;
`

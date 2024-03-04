import { useContext } from 'react'
import styled from 'styled-components'

import { SelectedNodeContext } from '../contexts'

const ActionsControl = () => {
  const {selectedNode: node} = useContext(SelectedNodeContext)

  return (
    <Container>
    
    </Container>
  )
}

export default ActionsControl

const Container = styled.div`
  margin-top: 24px;
`

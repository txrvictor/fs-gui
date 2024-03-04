import { useContext } from 'react'
import styled from 'styled-components'

import { SelectedNodeContext } from '../contexts'
import PropertiesPanel from './properties-panel'
import TargetPanel from './target-panel'
import Panel from '../components/panel'
import { getNodeIcon } from '../utils/node'

const NodeInfo = () => {
  const {selectedNode: node} = useContext(SelectedNodeContext)

  const iconSize = node?.type === 'file' ? 32 : 36

  return (
    <Container>
      <Header>
        {node && (
          <HeaderIcon>
            <img 
              src={getNodeIcon(node.type)}
              // compensate different icon sizes
              style={{height: iconSize, width: iconSize}}
            />
          </HeaderIcon>
        )}
        <Name>
          {node?.name || 'Main Directory'}
        </Name>
      </Header>
      <PropertiesPanel />
      <TargetPanel />
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

const Header = styled.div`
  display: flex;
  align-items: center;
`

const HeaderIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  width: 36px;
  margin-right: 12px;

  img {
    height: inherit;
    width: inherit;
  }
`

const Name = styled.p`
  font-size: 1.5em;
  font-weight: bold;
  overflow: hidden; 
  text-overflow: ellipsis;
  white-space: nowrap;
`

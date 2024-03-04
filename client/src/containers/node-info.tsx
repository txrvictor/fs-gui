import { useContext } from 'react'
import styled from 'styled-components'

import { SelectedNodeContext } from '../contexts'
import PropertiesPanel from './properties-panel'
import TargetPanel from './target-panel'
import Panel from '../components/panel'
import { getNodeIcon } from '../utils/node'
import ActionsPanel from './actions-panel'

const NodeInfo = () => {
  const {selectedNode: node} = useContext(SelectedNodeContext)

  const iconSize = node?.type === 'file' ? 32 : 36

  return (
    <Container>
      <div>
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
      </div>

      <div>
        <ActionsPanel />
      </div>
    </Container>
  )
}

export default NodeInfo

const Container = styled(Panel)`
  height: 400px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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

/* eslint-disable @typescript-eslint/no-explicit-any */
import { MouseEventHandler, useCallback, useContext } from 'react'
import styled from 'styled-components'

import { SelectedNodeContext } from '../contexts'
import Panel from '../components/panel'
import { getNodeIcon } from '../utils/node'
import Checkbox from '../components/checkbox'

const NodeInfo = () => {
  const {selectedNode: node} = useContext(SelectedNodeContext)

  const onPropertyChange: MouseEventHandler<HTMLInputElement> = useCallback((evt: any) => {
    const key: string = evt.target.name
    const value: boolean = evt.target.checked

    // TODO call change property
    console.log({key, value})
  }, [])

  const iconSize = node?.type === 'file' ? 32 : 36

  return (
    <Container>
      <Header>
        {node && (
          <Icon>
            <img 
              src={getNodeIcon(node.type)}
              // compensate different icon sizes
              style={{height: iconSize, width: iconSize}}
            />
          </Icon>
        )}
        <Name>
          {node?.name || 'Main Directory'}
        </Name>
      </Header>

      {node?.properties && (
        <>
          <SectionLabel>Properties</SectionLabel>
          <PropertiesContainer>
              {Object.keys(node.properties).map((key) => {
                if (!node?.properties) {
                  return null
                }
                const value: boolean = node.properties[key] || false
                return (
                  <Checkbox
                    key={key}
                    name={key}
                    label={key}
                    defaultChecked={value}
                    onClick={onPropertyChange}
                  />
                )
              })}
          </PropertiesContainer>
        </>
      )}

      {node?.type === 'symbolicLink' && (
        <>
          <SectionLabel>Symbolic Link to:</SectionLabel>
          <TargetLink>{node?.target || 'No target'}</TargetLink>
        </>
      )}
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

const Icon = styled.div`
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

const SectionLabel = styled.p`
  margin-top: 1em;
  font-size: 1.2em;
  font-style: italic;
  text-align: left;
`

const PropertiesContainer = styled.div`
  margin-top: 0.1em;
  border: 1px dashed #C6C6C6;
  border-radius: 2px;
  padding: 0.3em;
`

const TargetLink = styled.div`
  margin-top: 0.1em;
  font-family: 'Roboto Mono', 'Courier New', monospace;
  font-size: 1.2em;
  font-weight: 600;
  color: #E1205C;
  background-color: #F6F6F6;
  border: 2px solid #DADADA;
  border-radius: 4px;
  padding: 0.2em;
  overflow-x: auto;
`
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEventHandler, useCallback, useContext } from 'react'
import styled from 'styled-components'

import { RootNodeContext, SelectedNodeContext } from '../contexts'
import { toggleNodeProperties } from '../api'
import Panel from '../components/panel'
import Checkbox from '../components/checkbox'
import { getNodeIcon, findNodeByPath } from '../utils/node'

const NodeInfo = () => {
  const {setRoot} = useContext(RootNodeContext)
  const {selectedNode: node, setSelectedNode} = useContext(SelectedNodeContext)

  const onPropertyChange: ChangeEventHandler<HTMLInputElement> = useCallback(async (evt: any) => {
    if (!node) {
      return
    }
    const key: string = evt.target.name

    // handle root element
    const fullPath = node.fullPath === '' ? '/' : node.fullPath
    try {
      const updatedRoot = await toggleNodeProperties(fullPath, key)
      setRoot(updatedRoot)

      // re-select node based on updated root
      const newSelectedNode = findNodeByPath(updatedRoot, node.fullPath)
      if (newSelectedNode) {
        setSelectedNode(newSelectedNode)
      } else {
        // fallback if it fails
        setSelectedNode(updatedRoot)
      }

      // TODO show success toast

    } catch (err) {
      console.error(err)

      // TODO show fail toast

    }
  }, [node, setRoot, setSelectedNode])

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
                    // defaultChecked={value}
                    checked={value}
                    onChange={onPropertyChange}
                  />
                )
              })}
          </PropertiesContainer>
        </>
      )}

      {node?.type === 'symbolicLink' && (
        <>
          <SectionLabel>Symbolic Link path</SectionLabel>
          <TargetLink>{node?.target || 'No target'}</TargetLink>
        </>
      )}

      {node?.targetRef && (
        <>
          <SectionLabel>Refers to</SectionLabel>
          <TargetRef>
            <p><b>[{node.targetRef.type.toUpperCase()}]:</b></p>
            <SmallIcon src={getNodeIcon(node.targetRef.type)} />
            <p>{node.targetRef.name}</p>
          </TargetRef>
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
const TargetRef = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: 1.2em;
  padding-left: 0.1em;
`

const SmallIcon = styled.img`
  height: 1.2em;
  margin-left: 0.6em;
  margin-right: 0.3em;
`
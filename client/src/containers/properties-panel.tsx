/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEventHandler, useCallback, useContext } from 'react'
import styled from 'styled-components'

import { RootNodeContext, SelectedNodeContext } from '../contexts'
import { toggleNodeProperties } from '../api'
import Checkbox from '../components/checkbox'
import { findNodeByPath } from '../utils/node'

const PropertiesPanel = () => {
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
    } catch (err) {
      console.error(err)
    }
  }, [node, setRoot, setSelectedNode])

  if (!node?.properties) {
    return null
  }

  return (
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
                checked={value}
                onChange={onPropertyChange}
              />
            )
          })}
      </PropertiesContainer>
    </>
  )
}

export default PropertiesPanel

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

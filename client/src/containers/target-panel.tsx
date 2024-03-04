import { useContext } from 'react'
import styled from 'styled-components'

import { SelectedNodeContext } from '../contexts'
import { getNodeIcon } from '../utils/node'

const TargetPanel = () => {
  const {selectedNode: node} = useContext(SelectedNodeContext)

  if (node?.type !== 'symbolicLink') {
    return null
  }

  return (
    <>
      <SectionLabel>Symbolic Link path</SectionLabel>
      <TargetLink>{node?.target || 'No target'}</TargetLink>

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
   </>
  )
}

export default TargetPanel

const SectionLabel = styled.p`
  margin-top: 1em;
  font-size: 1.2em;
  font-style: italic;
  text-align: left;
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
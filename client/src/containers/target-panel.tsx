import { useContext } from 'react'
import styled from 'styled-components'

import { SelectedNodeContext } from '../contexts'
import PathDisplay from '../components/path-display'
import { getNodeIcon } from '../utils/node'

const TargetPanel = () => {
  const {selectedNode: node} = useContext(SelectedNodeContext)

  if (node?.type !== 'symbolicLink') {
    return null
  }

  return (
    <>
      <SectionLabel>Symbolic Link path</SectionLabel>
      <PathDisplay style={{marginTop: '0.1em'}}>
        {node?.target || 'No target'}
      </PathDisplay>

      <SectionLabel>Refers to</SectionLabel>
      <TargetRef>
        {node?.targetRef ? (
          <>
            <p><b>[{node.targetRef.type.toUpperCase()}]:</b></p>
            <SmallIcon src={getNodeIcon(node.targetRef.type)} />
            <p>{node.targetRef.name}</p>
          </>
        ) : (
          <p><b>{`[ ! Not found ]`}</b></p>
        )}
       </TargetRef>
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
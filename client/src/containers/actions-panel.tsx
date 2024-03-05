import { useContext } from 'react'
import styled from 'styled-components'

import { ActionContext, SelectedNodeContext } from '../contexts'
import IconButton from '../components/icon-button'

import AddFile from '../assets/add-file.svg'
import AddFolder from '../assets/add-folder.svg'
import AddLink from '../assets/add-link.svg'
import Move from '../assets/move.svg'
import Delete from '../assets/delete.svg'

/**
 * Used within the NodeInfo Panel to display available action buttons
 * based on the type of the selected element of the FS tree.
 */
const ActionsPanel = () => {
  const {selectedNode: node} = useContext(SelectedNodeContext)
  const {action, setAction} = useContext(ActionContext)

  const isFolder = node?.type === 'folder'
  const isRoot = node?.name === '' && node?.fullPath === ''

  return (
    <>
      <SectionLabel>Actions</SectionLabel>
      <Container>
        {isFolder && (
          <>
            <IconButton 
              icon={AddFile}
              alt="Create a file here"
              highlight={action === 'add-file'}
              onClick={() => setAction('add-file')} 
            />
            <IconButton
              icon={AddFolder}
              alt="Create a folder here"
              highlight={action === 'add-folder'}
              onClick={() => setAction('add-folder')}
            />
            <IconButton
              icon={AddLink}
              alt="Create a symbolic link here"
              highlight={action === 'add-link'}
              onClick={() => setAction('add-link')}
            />
          </>
        )}
        {!isRoot && (
          <>
            <IconButton
              icon={Move}
              alt="Move this"
              highlight={action === 'move'}
              onClick={() => setAction('move')}
            />
            <IconButton
              icon={Delete}
              alt="Delete this"
              highlight={action === 'delete'}
              onClick={() => setAction('delete')}
            />
          </>
        )}
      </Container>
    </>
  )
}

export default ActionsPanel

const SectionLabel = styled.p`
  margin-top: 1em;
  font-size: 1.2em;
  font-style: italic;
  text-align: left;
`

const Container = styled.div`
  margin-top: 0.1em;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;

  button + button {
    margin-left: 0.2em;
  }
`

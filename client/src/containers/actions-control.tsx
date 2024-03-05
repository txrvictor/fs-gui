import { useContext } from 'react'
import styled from 'styled-components'

import { ActionContext, ActionType, SelectedNodeContext } from '../contexts'
import { NodeElement } from '../api/types'
import Panel from '../components/panel'
import IconButton from '../components/icon-button'

import CloseIcon from '../assets/close.svg'
import AddNodeForm from './add-node-form'
import AddLinkForm from './add-link-form'
import MoveNodeForm from './move-node-form'
import DeleteNodeForm from './delete-node-form'
import FormLabel from '../components/form-label'
import PathDisplay from '../components/path-display'

const renderForm = (node: NodeElement, action: ActionType) => {
    switch (action) {
      case 'add-file':
      case 'add-folder':
        return <AddNodeForm node={node} type={action} />
      case 'add-link':
        return <AddLinkForm node={node} />
      case 'move':
        return <MoveNodeForm node={node} />
      case 'delete':
        return <DeleteNodeForm node={node} />
      default:
        return null
    }
}

/**
 * Panel displayed under the selected element information panel on 
 * the right side of the UI. Used as a wrapper for the different 
 * operation forms.
 */
const ActionsControl = () => {
  const {action, setAction} = useContext(ActionContext)
  const {selectedNode} = useContext(SelectedNodeContext)

  if (!action || !selectedNode) {
    return null
  }

  const currentPath = selectedNode.type === 'folder' ?
    `${selectedNode.fullPath}/` : selectedNode.fullPath 

  return (
    <Container>
      <FormLabel style={{marginTop: '0.4em'}}>Current path:</FormLabel>
      <PathDisplay>{currentPath}</PathDisplay>

      {renderForm(selectedNode, action)}
      
      {/* absolute on top right corner */}
      <Close>
        <IconButton 
          icon={CloseIcon}
          style={{fontSize: '0.8em'}}
          onClick={() => setAction(undefined)}
        />
      </Close>
    </Container>
  )
}

export default ActionsControl

const Container = styled(Panel)`
  position: relative;
  margin-top: 24px;
  display: flex;
  flex-direction: column;
`

const Close = styled.div`
  position: absolute;
  top: 0.2em;
  right: 0.2em;
`

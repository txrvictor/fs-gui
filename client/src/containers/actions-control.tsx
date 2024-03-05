import { useContext } from 'react'
import styled from 'styled-components'

import { ActionContext, ActionType } from '../contexts'
import Panel from '../components/panel'
import IconButton from '../components/icon-button'

import CloseIcon from '../assets/close.svg'
import AddNodeForm from './add-node-form'
import AddLinkForm from './add-link-form'
import MoveNodeForm from './move-node-form'
import DeleteNodeForm from './delete-node-form'

const renderForm = (action: ActionType) => {
    switch (action) {
      case 'add-file':
      case 'add-folder':
        return <AddNodeForm type={action} />
      case 'add-link':
        return <AddLinkForm />
      case 'move':
        return <MoveNodeForm />
      case 'delete':
        return <DeleteNodeForm />
      default:
        return null
    }
}

const ActionsControl = () => {
  const {action, setAction} = useContext(ActionContext)

  if (!action) {
    return null
  }

  return (
    <Container>
      {renderForm(action)}
      
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
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const Close = styled.div`
  position: absolute;
  top: 0.2em;
  right: 0.2em;
`

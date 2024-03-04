import { useState, useContext, useMemo } from 'react'
import styled from 'styled-components'

import { ActionContext, RootNodeContext, SelectedNodeContext } from '../contexts'
import { deleteNode } from '../api'
import PathDisplay from '../components/path-display'
import Button from '../components/button'

const DeleteNodeForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>()

  const {setAction} = useContext(ActionContext)
  const {setRoot} = useContext(RootNodeContext)
  const {selectedNode: node, setSelectedNode} = useContext(SelectedNodeContext)

  const onRequest = async () => {
    setError(undefined)

    if (!node) {
      return
    }

    const path = node.fullPath
    setIsLoading(true)
    try {
      const updatedRoot = await deleteNode(path)
      setRoot(updatedRoot)
      setSelectedNode(updatedRoot)
      setAction(undefined)
    } catch (err: any) {
      console.log({err})
      setError(err?.response?.data?.error || err.message)
    }
    setIsLoading(false)
  }

  const description = useMemo(() => {
    switch (node?.type) {
      case 'folder':
        return 'folder'
      case 'symbolicLink': 
        return 'Symbolic Link'
      default:
      case 'file': 
        return 'file'
    }
  }, [node?.type])

  return (
    <>
      <div>
        <PathDisplay style={{
          marginTop: '0.2em',
          marginBottom: '1em',
        }}>
          {node?.fullPath || '/'}
        </PathDisplay>

        <Label>
          {`Are you sure you want to delete this ${description}?`}
        </Label>
      </div>
      
      <ButtonWrapper>
        <CustomButton onClick={onRequest} disabled={isLoading}>
          Delete
        </CustomButton>
      </ButtonWrapper>

      {error !== undefined && <Error>{error}</Error>}
    </>
  )
}

export default DeleteNodeForm

const Label = styled.p`
  font-size: 1.1em;
  font-style: italic;
  text-align: left;
  margin-top: 0.8em;
  margin-bottom: 0.2em;
`

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 0.6em;
`

const CustomButton = styled(Button)`
  background-color: #FEC5BB;

  &:hover {
    border-color: #CC9389;
  }
`

const Error = styled.div`
  margin-top: 1.2em;
  font-size: 0.9em;
  font-weight: 500;
  text-align: left;
  background-color: #FEC5BB;
  border: 2px red solid;
  padding: 0.2em 0.4em;
  border-radius: 4px;
`

import { useState, useContext, useMemo } from 'react'
import styled from 'styled-components'

import { ActionContext, RootNodeContext, SelectedNodeContext } from '../contexts'
import { deleteNode } from '../api'
import { NodeElement } from '../api/types'
import FormLabel from '../components/form-label'
import FormError from '../components/form-error'
import Button from '../components/button'

interface Props {
  node: NodeElement
}

/**
 * Form used for deleting the current selected element of the FS tree.
 */
const DeleteNodeForm = (props: Props) => {
  const {node} = props

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>()

  const {setAction} = useContext(ActionContext)
  const {setRoot} = useContext(RootNodeContext)
  const {setSelectedNode} = useContext(SelectedNodeContext)

  const onRequest = async () => {
    if (!node) {
      return
    }
    
    const path = node.fullPath

    setError(undefined)
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
      <FormLabel style={{marginBottom: 0}}>
        {`Are you sure you want to delete this ${description}?`}
      </FormLabel>

      <CustomButton onClick={onRequest} disabled={isLoading}>
        Delete
      </CustomButton>

      {error !== undefined && <FormError>{error}</FormError>}
    </>
  )
}

export default DeleteNodeForm

const CustomButton = styled(Button)`
  background-color: #FEC5BB;
  margin-top: 0.8em;

  &:hover {
    border-color: #CC9389;
  }
`

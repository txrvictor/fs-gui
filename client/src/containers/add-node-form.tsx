import { useState, useContext, useRef, useEffect } from 'react'
import styled from 'styled-components'

import { ActionContext, RootNodeContext, SelectedNodeContext } from '../contexts'
import { addFile, addFolder } from '../api'
import { NodeElement } from '../api/types'
import FormLabel from '../components/form-label'
import Input from '../components/input'
import Button from '../components/button'
import FormError from '../components/form-error'

interface Props {
  node: NodeElement
  type: 'add-file' | 'add-folder'
}

const AddNodeForm = (props: Props) => {
  const {node, type} = props

  const ref = useRef<HTMLInputElement>(null)

  const [name, setName] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>()

  const {setAction} = useContext(ActionContext)
  const {setRoot} = useContext(RootNodeContext)
  const {setSelectedNode} = useContext(SelectedNodeContext)

  // auto focus on input
  useEffect(() => ref?.current?.focus(), [type])

  const onRequest = async () => {
    const nodeName = name?.trim()
    if (!nodeName || nodeName.length === 0) {
      return
    }

    const path = `${node.fullPath}/${nodeName}`
    
    setError(undefined)
    setIsLoading(true)
    try {
      const method = type === 'add-file' ? addFile : addFolder
      const updatedRoot = await method(path)
      setRoot(updatedRoot)
      setSelectedNode(updatedRoot)
      setAction(undefined)
    } catch (err: any) {
      console.log({err})
      setError(err?.response?.data?.error || err.message)
    }
    setIsLoading(false)
  }

  const disableButton = name?.trim()?.length === 0 || isLoading

  return (
    <>
      <FormLabel>
        Input the name of the <b>{type === 'add-file' ? 'file' : 'folder'}</b> to be created in the current path:
      </FormLabel>
      
      <Input
        ref={ref}
        placeholder='Name'
        value={name}
        onChange={setName}
        onEnter={onRequest}
      />

      <CustomButton onClick={onRequest} disabled={disableButton}>
        Create
      </CustomButton>

      {error !== undefined && <FormError>{error}</FormError>}
    </>
  )
}

export default AddNodeForm

const CustomButton = styled(Button)`
  margin-top: 0.8em;
`

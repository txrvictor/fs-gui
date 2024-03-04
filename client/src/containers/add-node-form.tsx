import { useState, useContext, useRef, useEffect } from 'react'
import styled from 'styled-components'

import { ActionContext, RootNodeContext, SelectedNodeContext } from '../contexts'
import PathDisplay from '../components/path-display'
import Input from '../components/input'
import Button from '../components/button'
import { addFile } from '../api'

interface Props {
  type: 'add-file' | 'add-folder'
}

const AddNodeForm = (props: Props) => {
  const {type} = props

  const ref = useRef<HTMLInputElement>(null)

  const [name, setName] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>()

  const {setAction} = useContext(ActionContext)
  const {setRoot} = useContext(RootNodeContext)
  const {selectedNode: node} = useContext(SelectedNodeContext)

  // auto focus on input
  useEffect(() => ref?.current?.focus(), [type])

  const onRequest = async () => {
    setError(undefined)

    const nodeName = name?.trim()
    if (!node || !nodeName || nodeName.length === 0) {
      return
    }

    const path = `${node.fullPath}/${nodeName}`

    setIsLoading(true)
    try {
      const updatedRoot = await addFile(path)
      setRoot(updatedRoot)
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
      <PathDisplay style={{
        marginTop: '0.2em',
        marginBottom: '0.4em',
      }}>
        {`${node?.fullPath}/<input>`}
      </PathDisplay>
      <Label>
        Input the name of the <b>{type === 'add-file' ? 'file' : 'folder'}</b> to be created in the above path:
      </Label>
      
      <Input
        ref={ref}
        placeholder='Name'
        value={name}
        onChange={setName}
        onEnter={onRequest}
      />

      <ButtonWrapper>
        <Button onClick={onRequest} disabled={disableButton}>
          Create
        </Button>
      </ButtonWrapper>
      
      {/* TODO create container for this */}
      {error !== undefined && <Error>{error}</Error>}
    </>
  )
}

export default AddNodeForm

const Label = styled.p`
  font-size: 1.1em;
  font-style: italic;
  text-align: left;
  margin-top: 0.6em;
`

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 0.4em;
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

import { useState, useContext, useRef, useEffect, useMemo, useCallback } from 'react'
import styled from 'styled-components'

import { ActionContext, RootNodeContext, SelectedNodeContext } from '../contexts'
import { addLink } from '../api'
import PathDisplay from '../components/path-display'
import Input from '../components/input'
import SearchSelector from '../components/search-selector'
import Button from '../components/button'

interface TargetOption {
  value: string
  label: string
}

const AddLinkForm = () => {
  const ref = useRef<HTMLInputElement>(null)

  const {setAction} = useContext(ActionContext)
  const {flatRoot, setRoot} = useContext(RootNodeContext)
  const {selectedNode: node} = useContext(SelectedNodeContext)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>()

  const [name, setName] = useState<string>('')
  const [target, setTarget] = useState<TargetOption>()

  const options: Array<TargetOption> = useMemo(() => {
    // filter out symlinks and the root folder
    return flatRoot
      .filter((n) => n.type !== 'symbolicLink' && n.fullPath !== '')
      .map((n) => ({value: n.fullPath, label: n.fullPath}))
  }, [flatRoot])
  const selectOption = useCallback((e: any) => setTarget(e), [])

  // auto focus on input
  useEffect(() => ref?.current?.focus(), [])

  const onRequest = async () => {
    setError(undefined)

    const nodeName = name?.trim()
    if (!node || !nodeName || nodeName.length === 0 || !target) {
      return
    }

    const path = `${node.fullPath}/${nodeName}`
    const targetPath = target.value

    setIsLoading(true)
    try {
      const updatedRoot = await addLink(path, targetPath)
      setRoot(updatedRoot)
      setAction(undefined)
    } catch (err: any) {
      console.log({err})
      setError(err?.response?.data?.error || err.message)
    }
    setIsLoading(false)
  }

  const disableButton = name?.trim()?.length === 0 || !target || isLoading

  return (
    <>
      <PathDisplay style={{
        marginTop: '0.2em',
        marginBottom: '1em',
      }}>
        {`${node?.fullPath}/<input>`}
      </PathDisplay>

      <Label>
        Input the name of the symlink to be created in the above path:
      </Label>
      
      <Input
        ref={ref}
        placeholder='Name'
        value={name}
        onChange={setName}
        onEnter={onRequest}
      />

      <Label>
        Select the target element:
      </Label>

      <SearchSelector
        options={options}
        value={target}
        onChange={selectOption}
      />

      <ButtonWrapper>
        <Button onClick={onRequest} disabled={disableButton}>
          Create
        </Button>
      </ButtonWrapper>

      {error !== undefined && <Error>{error}</Error>}
    </>
  )
}

export default AddLinkForm

const Label = styled.p`
  font-size: 1.1em;
  font-style: italic;
  text-align: left;
  margin-top: 0.6em;
`

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 0.6em;
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

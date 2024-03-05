import { useState, useContext, useRef, useEffect, useMemo, useCallback } from 'react'
import styled from 'styled-components'

import { ActionContext, RootNodeContext, SelectedNodeContext } from '../contexts'
import { addLink } from '../api'
import { NodeElement } from '../api/types'
import FormLabel from '../components/form-label'
import FormError from '../components/form-error'
import Input from '../components/input'
import SearchSelector from '../components/search-selector'
import Button from '../components/button'

interface TargetOption {
  value: string
  label: string
}

interface Props {
  node: NodeElement
}

/**
 * Form used to add a symbolic link inside the current selected
 * element of the FS tree.
 */
const AddLinkForm = (props: Props) => {
  const {node} = props

  const ref = useRef<HTMLInputElement>(null)

  const {setAction} = useContext(ActionContext)
  const {flatRoot, setRoot} = useContext(RootNodeContext)
  const {setSelectedNode} = useContext(SelectedNodeContext)

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
    const nodeName = name?.trim()
    if (!nodeName || nodeName.length === 0 || !target) {
      return
    }

    const path = `${node.fullPath}/${nodeName}`
    const targetPath = target.value
    
    setError(undefined)
    setIsLoading(true)
    try {
      const updatedRoot = await addLink(path, targetPath)
      setRoot(updatedRoot)
      setSelectedNode(updatedRoot)
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
      <FormLabel>
        Input the name of the symlink to be created in the current path:
      </FormLabel>
      
      <Input
        ref={ref}
        placeholder='Name'
        value={name}
        onChange={setName}
        onEnter={onRequest}
      />

      <FormLabel>
        Select the target element:
      </FormLabel>

      <SearchSelector
        options={options}
        value={target}
        onChange={selectOption}
      />

      <CustomButton onClick={onRequest} disabled={disableButton}>
        Create
      </CustomButton>

      {error !== undefined && <FormError>{error}</FormError>}
    </>
  )
}

export default AddLinkForm

const CustomButton = styled(Button)`
  margin-top: 0.8em;
`

import { useState, useContext, useRef, useEffect, useMemo, useCallback } from 'react'
import styled from 'styled-components'

import { ActionContext, RootNodeContext, SelectedNodeContext } from '../contexts'
import { moveNode } from '../api'
import { NodeElement } from '../api/types'
import FormLabel from '../components/form-label'
import FormError from '../components/form-error'
import SearchSelector from '../components/search-selector'
import Button from '../components/button'

interface TargetOption {
  value: string
  label: string
}

interface Props {
  node: NodeElement
}

const ModeNodeForm = (props: Props) => {
  const {node} = props

  const ref = useRef<HTMLInputElement>(null)

  const {setAction} = useContext(ActionContext)
  const {flatRoot, setRoot} = useContext(RootNodeContext)
  const {setSelectedNode} = useContext(SelectedNodeContext)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>()

  const [target, setTarget] = useState<TargetOption>()

  const options: Array<TargetOption> = useMemo(() => {
    // only display folders as destination
    return flatRoot
      .filter((n) => n.type === 'folder')
      .map((n) => ({
        value: n.fullPath || '/',
        label: n.fullPath || 'Main Directory',
      }))
  }, [flatRoot])
  const selectOption = useCallback((e: any) => setTarget(e), [])

  // auto focus on input
  useEffect(() => ref?.current?.focus(), [])

  const onRequest = async () => {
    if (!target) {
      return
    }

    const currentPath = node.fullPath
    const targetPath = target.value
    
    setError(undefined)
    setIsLoading(true)
    try {
      const updatedRoot = await moveNode(currentPath, targetPath)
      setRoot(updatedRoot)
      setSelectedNode(updatedRoot)
      setAction(undefined)
    } catch (err: any) {
      console.log({err})
      setError(err?.response?.data?.error || err.message)
    }
    setIsLoading(false)
  }

  const disableButton = !target || isLoading

  return (
    <>
      <FormLabel>
        Select the target folder:
      </FormLabel>

      <SearchSelector
        options={options}
        value={target}
        onChange={selectOption}
      />

      <CustomButton onClick={onRequest} disabled={disableButton}>
        Move
      </CustomButton>

      {error !== undefined && <FormError>{error}</FormError>}
    </>
  )
}

export default ModeNodeForm

const CustomButton = styled(Button)`
  margin-top: 0.8em;
`

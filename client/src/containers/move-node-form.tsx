import { useState, useContext, useRef, useEffect, useMemo, useCallback } from 'react'
import styled from 'styled-components'

import { ActionContext, RootNodeContext, SelectedNodeContext } from '../contexts'
import { moveNode } from '../api'
import PathDisplay from '../components/path-display'
import SearchSelector from '../components/search-selector'
import Button from '../components/button'

interface TargetOption {
  value: string
  label: string
}

const ModeNodeForm = () => {
  const ref = useRef<HTMLInputElement>(null)

  const {setAction} = useContext(ActionContext)
  const {flatRoot, setRoot} = useContext(RootNodeContext)
  const {selectedNode: node, setSelectedNode} = useContext(SelectedNodeContext)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>()

  const [target, setTarget] = useState<TargetOption>()

  const options: Array<TargetOption> = useMemo(() => {
    // only display folders as destination
    return flatRoot
      .filter((n) => n.type === 'folder')
      .map((n) => ({value: n.fullPath, label: n.fullPath}))
  }, [flatRoot])
  const selectOption = useCallback((e: any) => setTarget(e), [])

  // auto focus on input
  useEffect(() => ref?.current?.focus(), [])

  const onRequest = async () => {
    setError(undefined)

    if (!node || !target) {
      return
    }

    const currentPath = node.fullPath
    const targetPath = target.value

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
      <div>
        <PathDisplay style={{
          marginTop: '0.2em',
          marginBottom: '1em',
        }}>
          {`${node?.fullPath}/<input>`}
        </PathDisplay>

        <Label>
          Select the target folder:
        </Label>

        <SearchSelector
          options={options}
          value={target}
          onChange={selectOption}
        />
      </div>

      <ButtonWrapper>
        <Button onClick={onRequest} disabled={disableButton}>
          Move
        </Button>
      </ButtonWrapper>

      {error !== undefined && <Error>{error}</Error>}
    </>
  )
}

export default ModeNodeForm

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

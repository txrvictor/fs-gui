import { useCallback, useContext, useMemo } from 'react'
import styled from 'styled-components'

import { RootNodeContext, SelectedNodeContext } from '../contexts'
import { NodeElement } from '../api/types'
import Panel from '../components/panel'
import TreeNode from '../components/tree-node'

const renderChildrenRecursively = (node: NodeElement, index = 0) => (
  <TreeNode
    key={`${node.name}_${index}`}
    value={node}
    renderChildren={renderChildrenRecursively}
  />
)

const DirectoryTree = () => {
  const root = useContext(RootNodeContext)
  const {setSelectedNode} = useContext(SelectedNodeContext)
 
  const onClick: React.MouseEventHandler<HTMLDivElement> = useCallback((evt) => {
    evt.preventDefault()
    root && setSelectedNode(root)
  }, [root, setSelectedNode])

  const rootChildren = useMemo(() => {
    return Object.entries(root?.children || {}).map((e) => e[1])
  }, [root])

  if (!root) {
    return null
  }

  return (
    <Container>
      {/* render the root directory as a fixed element */}
      <RootLabel onClick={onClick}>
        <p>Main Directory</p>
      </RootLabel>

      <RootChildren>
        {rootChildren.map((child) => renderChildrenRecursively(child))}
      </RootChildren>
    </Container>
  )
}

export default DirectoryTree

const Container = styled(Panel)`
  flex: 2;
  min-height: 600px;
  height: 70vh;
  overflow: auto;
`

const RootLabel = styled.div`
  font-size: 1.5em;
  font-style: italic;
  margin-bottom: 6px;

  :hover {
    cursor: pointer;
    font-weight: bold;
  }
`

const RootChildren = styled.div`
  > div {
    border-left: none;
    margin-left: 0;
  }
`
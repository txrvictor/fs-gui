import { useCallback, useContext, useMemo } from 'react'
import styled from 'styled-components'

import { RootNodeContext, SelectedNodeContext } from '../contexts'
import Panel from '../components/panel'
import TreeNode from '../components/tree-node'

const DirectoryTree = () => {
  const {root} = useContext(RootNodeContext)
  const {selectedNode, setSelectedNode} = useContext(SelectedNodeContext)
 
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
      <RootLabel onClick={onClick} $isSelected={root.id === selectedNode?.id}>
        <p>Main Directory</p>
      </RootLabel>

      <RootChildren>
        {rootChildren.map((child) => <TreeNode key={child.id} value={child} />)}
      </RootChildren>
    </Container>
  )
}

export default DirectoryTree

const Container = styled(Panel)`
  flex: 2;
  min-height: 750px;
  height: 70vh;
  overflow: auto;
`

const RootLabel = styled.div<{$isSelected: boolean}>`
  font-size: 1.5em;
  font-style: italic;
  color: ${props => (props.$isSelected ? `#E1205C` : `initial`)};
  font-weight: ${props => (props.$isSelected ? `bold` : `initial`)};
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

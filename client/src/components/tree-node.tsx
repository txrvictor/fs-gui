import { useCallback, useContext, useMemo, useState } from 'react'
import styled from 'styled-components'

import { RootNodeContext, SelectedNodeContext } from '../contexts'
import { NodeElement, NodeType } from '../api/types'
import { findNodeByPath } from '../utils/node'

import FolderIcon from '../assets/folder.svg'
import FileIcon from '../assets/file.svg'
import SymlinkIcon from '../assets/symlink.svg'

const renderIcon = (type: NodeType) => {
  switch(type) {
    case 'folder':
      return FolderIcon
    case 'symbolicLink':
      return SymlinkIcon
    case 'file': 
    default:
      return FileIcon
  }
}

interface Props {
  value: NodeElement
  renderChildren: (node: NodeElement, index?: number) => React.ReactNode
}

const TreeNode = (props: Props) => {
  const {value: node, renderChildren} = props

  const root = useContext(RootNodeContext)
  const {setSelectedNode} = useContext(SelectedNodeContext)

  const [expanded, setExpanded] = useState<boolean>(false)
  const [loadedChildren, setLoadedChildren] = useState<Array<NodeElement>>()

  const onClick: React.MouseEventHandler<HTMLDivElement> = useCallback((evt) => {
    evt.preventDefault()
    evt.stopPropagation()

    // in case this is a symbolic link, we must refer to the original target node
    // when displaying the info on the right side panel. If it fails, just show the symlink
    let selectedNode = node
    if (root && node.type === 'symbolicLink' && node.target) {
      const foundNode = findNodeByPath(root, node.target)
      if (foundNode) {
        selectedNode = foundNode
      }
    }
    setSelectedNode(selectedNode)

    // load the children on state and toggle expand to render them
    if (selectedNode?.children) {
      setLoadedChildren(Object.entries(selectedNode.children).map((e) => e[1]))
      setExpanded((prevState) => !prevState)
    }
  }, [root, node, setSelectedNode])

  const displayedChildren = useMemo(() => loadedChildren?.map((child, i) => {
    return renderChildren(child, i)
  }), [loadedChildren, renderChildren])

  return (
    <Container>
      <NodeLabel onClick={onClick}>
        <Icon src={renderIcon(node.type)} />
        <p>{node.name}</p>
      </NodeLabel>

      {expanded && displayedChildren}
    </Container>
  )
}

export default TreeNode

const Container = styled.div`
  margin-left: 0.7em;
  padding-left: 1em;
  border-left: 1px dashed #C6C6C6;
`

const NodeLabel = styled.div`
  font-size: 1.3em;
  display: flex;
  align-items: center;
  
  &:hover {
    cursor: pointer;
    font-weight: bold;
    background-color: #FFFFFF;
  }
`

const Icon = styled.img`
  width: 1.2em;
  margin-right: 0.3em;
`

import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
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
}

const TreeNode = (props: Props) => {
  const {value: node} = props

  const root = useContext(RootNodeContext)
  const {setSelectedNode} = useContext(SelectedNodeContext)

  // auto expand folders and only expand symlinks on click to prevent loop crash
  const isFolder = node.type === 'folder'
  const [expanded, setExpanded] = useState<boolean>(isFolder)
  const [loadedChildren, setLoadedChildren] = useState<Array<NodeElement>>()

  const loadChildren = useCallback((node: NodeElement) => {
    if (node.type === 'folder' && node.children) {
      setLoadedChildren(Object.entries(node.children).map((e) => e[1]))
    }
  }, [])

  useEffect(() => {
    loadChildren(node)
  }, [node, loadChildren])

  const onClick: React.MouseEventHandler<HTMLDivElement> = useCallback((evt) => {
    evt.preventDefault()
    evt.stopPropagation()

    setExpanded((prevState) => !prevState)

    // in case this is a symlink, we can save a reference to the original
    const selectedNode = node
    if (root && node.type === 'symbolicLink' && node.target) {
      const originalNode = findNodeByPath(root, node.target)
      if (originalNode) {
        selectedNode.targetRef = originalNode
        loadChildren(originalNode)
      }
    }
    setSelectedNode(selectedNode)
  }, [root, node, setSelectedNode, loadChildren])

  // optimization to only re-render children if it changes
  const childrenToRender = useMemo(() => loadedChildren?.map((child) => (
    <TreeNode key={child.id} value={child} />
  )), [loadedChildren])

  return (
    <Container>
      <NodeLabel onClick={onClick}>
        <Icon src={renderIcon(node.type)} />
        <p>{node.name}</p>
      </NodeLabel>

      {expanded && childrenToRender}
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

import { useCallback, useContext } from 'react'
import styled from 'styled-components'

import { SelectedNodeContext } from '../contexts'
import { NodeElement, NodeType } from '../api/types'

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
  const {value, renderChildren} = props
  const {name, type, children} = value

  const {setSelectedNode} = useContext(SelectedNodeContext)

  const onClick: React.MouseEventHandler<HTMLDivElement> = useCallback((evt) => {
    evt.preventDefault()
    evt.stopPropagation()

    setSelectedNode(value)
  }, [])

  return (
    <Container>
      <NodeLabel onClick={onClick}>
        <Icon src={renderIcon(type)} />
        <p>{name}</p>
      </NodeLabel>

      {children !== undefined && Object.keys(children).map((key, i) => {
        const child = children[key]
        return renderChildren(child, i)
      })}
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

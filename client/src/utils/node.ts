/* eslint-disable @typescript-eslint/no-explicit-any */
import { NodeElement, NodeType } from "../api/types";

import FolderIcon from '../assets/folder.svg'
import FileIcon from '../assets/file.svg'
import SymlinkIcon from '../assets/symlink.svg'

export const getNodeIcon = (type: NodeType) => {
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

export function findNodeByPath(startingNode: NodeElement, path: string): NodeElement | null {
  let currentNode: NodeElement | null = startingNode

  const parts = path.split('/').filter((part) => part !== '')
  for (const nextPart of parts) {
    if (currentNode?.type === 'folder' && currentNode.children) {
      currentNode = currentNode.children[nextPart] || null
    } else if (currentNode?.type === 'symbolicLink' && currentNode?.target) {
      const targetNode = findNodeByPath(startingNode, currentNode.target)
      if (targetNode?.type === 'folder' && targetNode.children) {
        currentNode = targetNode.children[nextPart] || null
      } else {
        currentNode = null
      }
    } else {
      currentNode = null
    }
  }

  // if final node is a symbolic link, replace it with the original
  if (currentNode?.type ==='symbolicLink' && currentNode?.target) {
    currentNode = findNodeByPath(startingNode, currentNode.target)
  }

  return currentNode
}

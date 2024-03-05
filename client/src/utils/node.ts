import { NodeElement, NodeType } from "../api/types";

import FolderIcon from '../assets/folder.svg'
import FileIcon from '../assets/file.svg'
import SymlinkIcon from '../assets/symlink.svg'

/**
 * Returns an svg icon based on node type.
 * 
 * @param type node's type 
 * @returns svg icon
 */
export function getNodeIcon(type: NodeType) {
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

/**
 * Search for a node within the starting node given a string path. Returns the node if found,
 * otherwise returns null.
 * 
 * @param startingNode starting node to start the search
 * @param path path of the wanted node taking the starting node as base
 * @returns the node in the path or null if not found
 */
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

/**
 * Converts an element and it's children to an array of elements.
 * 
 * @param node starting node object to be converted in a node array
 * @param acc auxiliar variable used recursively to flatten the nested objects
 * @returns an array of node elements
 */
export function flattenNodes(node: NodeElement, acc: Array<NodeElement> = []): Array<NodeElement> {
  acc.push(node)

  Object.keys(node?.children || {}).forEach((child) => {
    if (node.children && node.children[child]){
      flattenNodes(node.children[child], acc)
    }
  })

  return acc
}

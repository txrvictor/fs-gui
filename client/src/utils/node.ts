import { NodeElement } from "../api/types";

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

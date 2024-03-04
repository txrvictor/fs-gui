import axios from 'axios'
import { NodeElement } from './types'

const api = axios.create({
  baseURL: 'http://localhost:5000',
})

export const getRoot = () => {
  return api.get<NodeElement>(`/root`).then((response) => response.data)
}

export const addFile = (path: string) => {
  return api.post<NodeElement>(`/node/file`, {
    path,
  }).then((response) => response.data)
}

export const addFolder = (path: string) => {
  return api.post<NodeElement>(`/node/directory`, {
    path,
  }).then((response) => response.data)
}

export const addLink = (path: string, targetNode: string) => {
  return api.post<NodeElement>(`/node/link`, {
    path,
    target: targetNode,
  }).then((response) => response.data)
}

export const toggleNodeProperties = (path: string, property: string) => {
  return api.post<NodeElement>(`/node/change`, {
    path,
    property,
  }).then((response) => response.data)
}

export const moveNode = (path: string, destinationNode: string) => {
  return api.post<NodeElement>(`/node/move`, {
    path,
    destination: destinationNode,
  }).then((response) => response.data)
}

export const deleteNode = (path: string) => {
  return api.delete<NodeElement>(`/node`, {
    data: {path},
  }).then((response) => response.data)
}

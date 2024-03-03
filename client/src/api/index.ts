import axios from 'axios'
import { NodeElement } from './types'

const api = axios.create({
  baseURL: 'http://localhost:5000',
})

export const getRoot = () => {
  return api.get<NodeElement>(`/root`).then((response) => response.data)
}

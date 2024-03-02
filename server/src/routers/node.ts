import { Router, Request, Response } from 'express'
import { body, query, validationResult } from 'express-validator'
import system from '../system'

const router = Router()

const addNodeValidationRules = [
  body('path').notEmpty().withMessage('Node path is required'),
]

router.post('/node/file', addNodeValidationRules, (req: Request, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const nodePath = req.body.path
  try {
    system.addFile(nodePath)
    res.send(system.root)
  } catch (err: any) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

router.post('/node/directory', addNodeValidationRules, (req: Request, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const nodePath = req.body.path
  try {
    system.addDirectory(nodePath)
    res.send(system.root)
  } catch (err: any) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

const addLinkValidationRules = [
  body('path').notEmpty().withMessage('New link path is required'),
  body('target').notEmpty().withMessage('Link target file path is required'),
]

router.post('/node/link', addLinkValidationRules, (req: Request, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const nodePath = req.body.path
  const targetPath = req.body.target
  try {
    system.addSymbolicLink(nodePath, targetPath)
    res.send(system.root)
  } catch (err: any) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

const moveValidationRules = [
  body('path').notEmpty().withMessage('Node path is required'),
  body('destination').notEmpty().withMessage('Node destination path is required'),
]

router.post('/node/move', moveValidationRules, (req: Request, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const nodePath = req.body.path
  const destinationPath = req.body.destination
  try {
    system.moveNode(nodePath, destinationPath)
    res.send(system.root)
  } catch (err: any) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

const changeValidationRules = [
  body('path').notEmpty().withMessage('Node path is required'),
  body('property').notEmpty().withMessage('Property to be toggle is required'),
]

router.post('/node/change', changeValidationRules, (req: Request, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const nodePath = req.body.path
  const property = req.body.property
  try {
    system.toggleNodeProperties(nodePath, property)
    res.send(system.root)
  } catch (err: any) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

const deleteValidationRules = [
  query('path').notEmpty().withMessage('Node path is required'),
]

router.delete('/node', deleteValidationRules, (req: Request, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const nodePath = <string>req.query.path
  try {
    system.deleteNode(nodePath)
    res.send(system.root)
  } catch (err) {
    res.status(500).send(err)
  }
})

export default router

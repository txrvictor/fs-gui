import FileSystem from "../controllers/fileSystem"
import { FileNode, FolderNode, NodeType, SymbolicLinkNode } from "../models"

test('Should create a folder in root directory', () => {
  const fs = new FileSystem()  
  fs.addDirectory('folder')

  const folder = <FolderNode>fs.root.children['folder']

  expect(folder).toBeDefined()
  expect(folder.name).toBe('folder')
  expect(folder.type).toBe(NodeType.Folder)
  expect(folder.children).toEqual({})
  expect(folder.properties['hidden']).toBe(false)
  expect(folder.properties['executable']).toBe(false)
})

test('Should create a folder inside another', () => {
  const fs = new FileSystem()  
  fs.addDirectory('folder')
  fs.addDirectory('folder/folder2')

  const folder = <FolderNode>(fs.root.children['folder'])
  const folder2 = folder.children['folder2']

  expect(folder2).toBeDefined()
})

test('Should create a file in root directory', () => {
  const fs = new FileSystem()  
  fs.addFile('file')

  const file = <FileNode>(fs.root.children['file'])

  expect(file).toBeDefined()
  expect(file.name).toBe('file')
  expect(file.type).toBe(NodeType.File)
  expect(file.properties['hidden']).toBe(false)
  expect(file.properties['executable']).toBe(false)
})

test('Should create a file inside a folder', () => {
  const fs = new FileSystem()  
  fs.addDirectory('folder')
  fs.addFile('folder/file')

  const folder = <FolderNode>(fs.root.children['folder'])
  const file = <FileNode>folder.children['file']

  expect(file).toBeDefined()
})

test('Should create a symbolic link of a file', () => {
  const fs = new FileSystem()  
  fs.addDirectory('folderA')
  fs.addFile('folderA/file')

  fs.addDirectory('folderB')
  fs.addSymbolicLink('folderB/symLinkFile', 'folderA/file')

  const folderB = <FolderNode>(fs.root.children['folderB'])
  const symLink = <SymbolicLinkNode>folderB.children['symLinkFile']
  const originalFileThroughLink = fs.getNode('folderB/symLinkFile')

  expect(symLink).toBeDefined()
  expect(symLink.name).toBe('symLinkFile')
  expect(symLink.type).toBe(NodeType.SymbolicLink)
  expect(symLink.target).toBe('folderA/file')

  expect(originalFileThroughLink).toBeDefined()
  expect(originalFileThroughLink?.name).toBe('file')
})

test('Should create a symbolic link of a folder', () => {
  const fs = new FileSystem()  
  fs.addDirectory('folderA')
  fs.addFile('folderA/fileA')

  fs.addDirectory('folderB')
  fs.addSymbolicLink('folderB/symLinkFolderA', 'folderA')

  const folderB = <FolderNode>(fs.root.children['folderB'])
  const symLink = <SymbolicLinkNode>folderB.children['symLinkFolderA']
  const originalFolderThroughLink = <FolderNode>fs.getNode('folderB/symLinkFolderA')

  expect(symLink).toBeDefined()
  expect(symLink.name).toBe('symLinkFolderA')
  expect(symLink.type).toBe(NodeType.SymbolicLink)
  expect(symLink.target).toBe('folderA')

  expect(originalFolderThroughLink).toBeDefined()
  expect(originalFolderThroughLink?.name).toBe('folderA')
  expect(originalFolderThroughLink?.children['fileA']).toBeDefined()
  expect(originalFolderThroughLink?.children['fileA'].name).toBe('fileA')
})

test('Should get a file', () => {
  const fs = new FileSystem()  
  fs.addDirectory('folder')
  fs.addFile('folder/file')

  const file = <FolderNode>fs.getNode('folder/file')
  expect(file).toBeDefined()
  expect(file.name).toBe('file')
  expect(file.type).toBe(NodeType.File)
  expect(file.properties['hidden']).toBe(false)
  expect(file.properties['executable']).toBe(false)
})

test('Should get a folder', () => {
  const fs = new FileSystem()  
  fs.addDirectory('folder')
  fs.addDirectory('folder/folder2')

  const folder2 = <FolderNode>fs.getNode('folder/folder2')
  expect(folder2).toBeDefined()
  expect(folder2.name).toBe('folder2')
  expect(folder2.type).toBe(NodeType.Folder)
  expect(folder2.children).toEqual({})
  expect(folder2.properties['hidden']).toBe(false)
  expect(folder2.properties['executable']).toBe(false)
})

test('Should move a file', () => {
  const fs = new FileSystem()  
  fs.addDirectory('folderA')
  fs.addFile('folderA/file')

  fs.addDirectory('folderB')
  fs.moveNode('folderA/file', 'folderB')

  const folderA = <FolderNode>(fs.root.children['folderA'])
  const folderB = <FolderNode>(fs.root.children['folderB'])
  const file = <FileNode>folderB.children['file']

  expect(folderA.children).toEqual({})
  expect(folderB).toBeDefined()
  expect(file).toBeDefined()
  expect(file.name).toBe('file')
})

test('Should move a folder and its contents', () => {
  const fs = new FileSystem()  
  fs.addDirectory('folderA')
  fs.addFile('folderA/file')
  fs.addDirectory('folderB')
  fs.moveNode('folderA', 'folderB')

  const folderB = <FolderNode>(fs.root.children['folderB'])
  const folderA = <FolderNode>(folderB.children['folderA'])
  const file = <FileNode>folderA.children['file']

  expect(folderB).toBeDefined()
  expect(folderB.name).toBe('folderB')
  expect(folderA).toBeDefined()
  expect(folderA.name).toBe('folderA')
  expect(file).toBeDefined()
  expect(file.name).toBe('file')
})

test('Should move a symbolic link', () => {
  const fs = new FileSystem()  
  fs.addDirectory('folderA')
  fs.addFile('folderA/fileA')
  fs.addDirectory('folderB')
  fs.addSymbolicLink('folderB/symLinkFolderA', 'folderA')
  fs.addDirectory('folderC')

  fs.moveNode('folderB/symLinkFolderA', 'folderC')

  const folderB = <FolderNode>(fs.root.children['folderB'])
  const folderC = <FolderNode>(fs.root.children['folderC'])
  const symLink = <SymbolicLinkNode>folderC.children['symLinkFolderA']
  const originalFolderThroughLink = <FolderNode>fs.getNode('folderC/symLinkFolderA')

  expect(folderB.children).toEqual({})

  expect(symLink).toBeDefined()
  expect(symLink.name).toBe('symLinkFolderA')
  expect(symLink.type).toBe(NodeType.SymbolicLink)
  expect(symLink.target).toBe('folderA')

  expect(originalFolderThroughLink).toBeDefined()
  expect(originalFolderThroughLink?.name).toBe('folderA')
  expect(originalFolderThroughLink?.children['fileA']).toBeDefined()
  expect(originalFolderThroughLink?.children['fileA'].name).toBe('fileA')
})

test('Should delete a file', () => {
  const fs = new FileSystem()  
  fs.addDirectory('folder')
  fs.addFile('folder/file')
  fs.addFile('folder/file2')

  const folder = <FolderNode>(fs.root.children['folder'])

  expect(<FileNode>folder.children['file']).toBeDefined()
  expect(<FileNode>folder.children['file2']).toBeDefined()

  fs.deleteNode('folder/file')

  expect(<FileNode>folder.children['file']).not.toBeDefined()
  expect(<FileNode>folder.children['file2']).toBeDefined()
})

test('Should delete a folder', () => {
  const fs = new FileSystem()  
  fs.addDirectory('folderA')
  fs.addFile('folderA/fileA')
  fs.addDirectory('folderA/folderB')
  fs.addFile('folderA/folderB/fileB')

  const folderA = <FolderNode>(fs.root.children['folderA'])

  expect(folderA.children['fileA']).toBeDefined()
  expect(folderA.children['folderB']).toBeDefined()

  fs.deleteNode('folderA/folderB')

  expect(<FileNode>folderA.children['folderB']).not.toBeDefined()
  expect(<FileNode>folderA.children['fileA']).toBeDefined()
})

test('Should delete a symbolic link', () => {
  const fs = new FileSystem()  
  fs.addDirectory('folderA')
  fs.addFile('folderA/fileA')

  fs.addDirectory('folderB')
  fs.addSymbolicLink('folderB/symLinkFolderA', 'folderA')

  const folderB = <FolderNode>(fs.root.children['folderB'])
  const symLink = <SymbolicLinkNode>folderB.children['symLinkFolderA']
  const originalFolderThroughLink = <FolderNode>fs.getNode('folderB/symLinkFolderA')

  expect(symLink).toBeDefined()
  expect(originalFolderThroughLink).toBeDefined()

  fs.deleteNode('folderB/symLinkFolderA')

  expect(<SymbolicLinkNode>folderB.children['symLinkFolderA']).not.toBeDefined()
  const linkAfterDelete = <FolderNode>fs.getNode('folderB/symLinkFolderA')
  expect(linkAfterDelete).toBeNull()
})

test('Should change properties of a file', () => {
  const fs = new FileSystem()
  fs.addDirectory('folder')
  fs.addFile('folder/file')
  
  const folder = <FolderNode>fs.root.children['folder']
  const file = <FileNode>folder.children['file']

  expect(file).toBeDefined()
  expect(file.properties['hidden']).toBe(false)
  expect(file.properties['executable']).toBe(false)

  fs.toggleNodeProperties('folder/file', 'hidden')
  expect(file.properties['hidden']).toBe(true)
  expect(file.properties['executable']).toBe(false)

  fs.toggleNodeProperties('folder/file', 'executable')
  expect(file.properties['hidden']).toBe(true)
  expect(file.properties['executable']).toBe(true)

  fs.toggleNodeProperties('folder/file', 'hidden')
  expect(file.properties['hidden']).toBe(false)
  expect(file.properties['executable']).toBe(true)

  expect(() => fs.toggleNodeProperties('folder/file', 'doNotExist')).toThrow(Error)
})

test('Should change properties of a folder and its children', () => {
  const fs = new FileSystem()
  fs.addDirectory('folder')
  fs.addFile('folder/fileA')
  fs.addFile('folder/fileB')

  const folder = <FolderNode>fs.root.children['folder']
  const fileA = <FileNode>folder.children['fileA']
  const fileB = <FileNode>folder.children['fileB']

  expect(folder.properties['hidden']).toBe(false)
  expect(folder.properties['executable']).toBe(false)
  expect(fileA.properties['hidden']).toBe(false)
  expect(fileA.properties['executable']).toBe(false)
  expect(fileB.properties['hidden']).toBe(false)
  expect(fileB.properties['executable']).toBe(false)

  fs.toggleNodeProperties('folder', 'executable')
  expect(folder.properties['hidden']).toBe(false)
  expect(folder.properties['executable']).toBe(true)
  expect(fileA.properties['hidden']).toBe(false)
  expect(fileA.properties['executable']).toBe(true)
  expect(fileB.properties['hidden']).toBe(false)
  expect(fileB.properties['executable']).toBe(true)

  fs.toggleNodeProperties('folder', 'hidden')
  expect(folder.properties['hidden']).toBe(true)
  expect(folder.properties['executable']).toBe(true)
  expect(fileA.properties['hidden']).toBe(true)
  expect(fileA.properties['executable']).toBe(true)
  expect(fileB.properties['hidden']).toBe(true)
  expect(fileB.properties['executable']).toBe(true)
})

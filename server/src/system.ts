import FileSystem from './controllers/fileSystem'

const SYSTEM = new FileSystem()

// Initial example structure
SYSTEM.addDirectory('a')
SYSTEM.addDirectory('b')
SYSTEM.addDirectory('b/a')
SYSTEM.addDirectory('b/a/c')
SYSTEM.addDirectory('b/b')
SYSTEM.addFile('b/b/k')
SYSTEM.addFile('b/b/m')
SYSTEM.addSymbolicLink('b/a/c/a', 'a')
SYSTEM.moveNode('b/b/m','a')
SYSTEM.toggleNodeProperties('b/b','hidden')

export default SYSTEM

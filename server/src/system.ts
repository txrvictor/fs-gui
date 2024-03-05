import FileSystem from './controllers/fileSystem'

/**
 * Global variable that holds the mock file system instance. All
 * operations executed through the web interface/API change this
 * instance directly.
 * 
 * Right now it only supports changing the in memory instance
 * while the server is up. An improvement would be persisting
 * the FileSystem's root object in a file or DB to be loaded
 * again after the server restarts.
 */
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

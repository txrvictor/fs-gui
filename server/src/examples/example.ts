import FileSystem from '../controllers/fileSystem'
import SystemHierarchyPrinter from '../utils/printer'

/**
 * File can be executed to print an example to the terminal.
 * From the fs-gui/server folder run:
 * 
 * $ npx ts-node ./src/utils/example.ts
 * 
 */
function printExample() {
  const fileSystem = new FileSystem()

  try {
    fileSystem.addDirectory('a')

    fileSystem.addDirectory('b')
    fileSystem.addDirectory('b/a')
    fileSystem.addDirectory('b/b')
    fileSystem.addDirectory('b/a/c')
  
    fileSystem.addFile('b/b/k')
    fileSystem.addFile('b/b/m')

    fileSystem.addSymbolicLink('b/a/c/a', 'a')

    fileSystem.moveNode('b/b/m','a')

    fileSystem.toggleNodeProperties('b/b','hide')
  } catch (e) {
    console.error(e)
  }
  
  const printer = new SystemHierarchyPrinter(fileSystem)
  printer.printNodeHierarchy(fileSystem.root)
}

printExample()

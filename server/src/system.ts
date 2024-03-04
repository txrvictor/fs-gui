import FileSystem from "./controllers/fileSystem";
import SystemHierarchyPrinter from "./utils/printer";

const SYSTEM = new FileSystem()


// TODO delete
SYSTEM.addDirectory('a')
SYSTEM.addDirectory('b')
SYSTEM.addDirectory('b/a')
SYSTEM.addDirectory('b/b')
SYSTEM.addDirectory('b/a/c')
SYSTEM.addFile('b/b/k')
SYSTEM.addFile('b/b/m')
SYSTEM.addSymbolicLink('b/a/c/a', 'a')
SYSTEM.moveNode('b/b/m','a')
SYSTEM.toggleNodeProperties('b/b','hidden')
SYSTEM.addFile('a/n')
SYSTEM.addFile('b/a/d')

SYSTEM.addSymbolicLink('a/symbLinkToBB', 'b/b')
SYSTEM.addSymbolicLink('b/b/symbLinkToA', 'a')

SYSTEM.addSymbolicLink('b/symbLinkToFileD', 'b/a/d')

const p = new SystemHierarchyPrinter(SYSTEM)
p.printNodeHierarchy(SYSTEM.root)

export default SYSTEM

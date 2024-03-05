# Client Application for FS-GUI

React Application to display a Web interface for managing a mock file system. All components were implemented from scratch with the exception of searchable dropdowns which use `react-select`. However, it was customized to follow the interface's theme. It enables the following operations within the mock file system from the GUI:

- Create files
- Create directories
- Create symbolic links to files or folders
- Move files, directories, and symbolic links
- Delete files, directories, and symbolic links
- Change pre-defined properties of files and directories (hidden, executable, read-only)

## Technologies

Please refer to the **package.json** file for more details.

| Tool | Use |
| :------ | :-----------|
| axios | Fetching REST API data in a simplified way |
| react | For building the interface |
| react-select | Creating a customized searchable dropdown |
| styled-components | Simplify adding CSS styles for React Components |
| typescript | Programming language, extends JavaScript by enforcing types |
| vite | Scaffolding the React application with Typescript and simplifying development by using the dev server with auto reload |


## Pre-requisites & Execution

It's necessary to use Node's package manager, [`npm`](https://nodejs.org/en/learn/getting-started/an-introduction-to-the-npm-package-manager), to execute a development mode of the app locally. For that, it's necessary:

- Install [Node.js](https://nodejs.org/) on the host OS
- Execute `npm install` inside the `fs-gui/client` folder
- Execute `npm run dev` (to run Vite's development server)
- The webpage will be accessible at `http://localhost:3000`


### Troubleshooting

If while running `npm run dev` it displays an error message such as:

```
sh: vite: not found
```

It may be some issue with `node_modules`. To solve this, please run:

- Inside `fs-gui/client` => `npm install`
- Try `npm run dev` again

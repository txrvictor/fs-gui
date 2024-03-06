# Server Application for FS-GUI

Node.js server application that contains all the logic for managing a mock file system and enabling modification through a REST API. It also contains functionality to print the file hierarchy on the terminal. The API endpoints offer:

- Retrieving the current file system hierarchy as a JSON object
  - Adds an unique ID for each node element
  - Keeps a reference to the full path of each node element
- Allowing elements creation
  - Files
  - Directories (folders)
  - Symbolic Links (of files and folders)
- Allowing moving files, directories, and symbolic links inside folders
- Allowing deletion of any elements except the root directory
- Allowing changing predefined properties of files and directories (hidden, executable, read-only)


## Technologies

Please refer to the **package.json** file for more details such as versions.

| Tool | Use |
| :------ | :-----------|
| cors | Express middleware for enabling CORS |
| express | Framework used for creating the REST API |
| express-validator | Express middleware for validating request params |
| uuid | Tool for generating unique IDs for each element of the file system |
| typescript | Programming language, extends JavaScript by enforcing types |
| jest | Used for unit tests |
| nodemon | Simplifies development by monitoring and auto-reloading the server when source code changes |


## Prerequisites & Execution

It's necessary to use Node's package manager, [`npm`](https://nodejs.org/en/learn/getting-started/an-introduction-to-the-npm-package-manager), to execute the server locally in development mode. For that, it's necessary to:

- Install [Node.js](https://nodejs.org/) on the host OS
- Execute from within `fs-gui/server`:
  - `npm install`
  - `npm run dev` (to start the Node.js server and enable nodemon file monitoring)
- The API will be accessible at `http://localhost:5000`


### Troubleshooting

If while running `npm run dev` it displays an error message such as:

```
sh: nodemon: not found
```

It may be some issue with `node_modules`. To solve this, please run:

- Inside `fs-gui/server` -> `npm install`
- Try `npm run dev` again


## Running tests

To run the unit tests run from the terminal:

- Inside `fs-gui/server` -> `npm run test`


## Running the example file

To see an example of output from the printer class which displays the system hierarch on the terminal, please run from within the `fs-gui/server` directory:

```
npx ts-node ./src/examples/example.ts
```

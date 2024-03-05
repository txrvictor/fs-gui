# Server Application for FS-GUI

Node.js server application that contains all the logic for managing a mock file system and enabling modification through a REST API. It also contains functionality to print the file hierarchy on the terminal. The API endpoints offer:

- Retrieving the current file system hierarchy as a JSON object
- Adding a unique ID for each node element
- Keeping the full path of each node element
- Allowing file creation
- Allowing directory creation
- Allowing symbolic link creation to existing files and folders
- Allowing moving files, directories, and symbolic links inside folders
- Allowing deletion of any elements except the root directory
- Allowing changing predefined properties of files and directories (hidden, executable, read-only)


## Technologies

Please refer to the **package.json** file for more details.

| Tool | Use |
| :------ | :-----------|
| cors | Express middleware for enabling CORS |
| express | Framework used for creating the REST API |
| express-validator | Express middleware for validating request params |
| uuid | Tool for generating unique IDs for each element of the file system |
| typescript | Programming language, extends JavaScript by enforcing types |
| jest | Used for unit tests |
| nodemon | Simplifies development by monitoring and auto-reloading the server when source code changes |


### Troubleshooting

If while running `npm run dev` it displays an error message such as:

```
sh: nodemon: not found
```

It may be some issue with `node_modules`. To solve this, please run:

- Inside `fs-gui/server` => `npm install`
- Try `npm run dev` again


## Running tests

To run the unit tests run from the terminal:

- Inside `fs-gui/server` => `npm run test`


## Running the example file

To see the printer class which displays the system file hierarch from the terminal, please run from within the `fs-gui/server` directory:

```
npx ts-node ./src/examples/example.ts
```

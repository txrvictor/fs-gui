# FS-GUI

Simple web GUI for a mock file system representation. Displays a file system hierarchical tree with toggable folders, files and symbolic links. It enables some actions such as creating, moving, deleting and changing a fixed set of properties for each element.

This project is divided in two parts: a React `client` project and a Node.js `server` project.


## Client

The **client** is a project scaffolded with [`Vite`](https://vitejs.dev/) running a [`React`](https://react.dev/) app and being served by Vite's development mode just for the sake of simplicity (enables auto-reload of the app while changing source code).

It's using a combination of React, [`TypeScript`](https://www.typescriptlang.org/) as the programming language, [`styled-components`](https://styled-components.com/) for simplifying adding CSS styles to the components and [`React Select`](https://react-select.com/) for searchable dropdowns in order to create an interface to manage the file system's prototype. To retrieve the structure of the file system data, it calls the **server**'s API using [`Axios`](https://axios-http.com/).


## Server

The **server** is a project using [`Node.js`](https://nodejs.org/) for serving a REST API that enable the management of the mock file system. It uses [`TypeScript`](https://www.typescriptlang.org/) as programming language, [`Express.js`](https://expressjs.com/) for serving the API (plus some auxiliary Express libraries for functionality such as [`cors`](https://github.com/expressjs/cors) and [`express-validator`](https://express-validator.github.io/)) and [`uuid`](https://github.com/uuidjs/uuid) as an unique ID generator tool.

Unit tests are written using [`Jest`](https://jestjs.io/). During development it uses the [`nodemon`](https://nodemon.io/) tool to auto-reload whenever some source code change happens.


## Prerequisites

In order to run both the client and the server, it's necessary to use Node's package manager, [`npm`](https://nodejs.org/en/learn/getting-started/an-introduction-to-the-npm-package-manager). For that, please follow Node's installation guideline for your host OS:

- Install [Node.js](https://nodejs.org/) (tested on `v20.10.0` but any newer version should be fine)
- Installation guideline can be found [here](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs)


## How to Execute

The **client** and the **server** can run independently; however, the client depends on the API served by the server, so it's better to start the server first. For instructions on how to run each, please refer to each **README.md** file contained inside the sub-folders:

- `fs-gui/server/README.md`
- `fs-gui/client/README.md`

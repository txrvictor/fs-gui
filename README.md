# fs-gui
Simple GUI for a file system representation

This project contains two parts, one is the `client` and another is the `server`. Both projects were dockerized to avoid installing its dependencies directly on the host OS.


### Client
The `client` is a project scaffolded with `Vite`(TODO add link) running a React app and being served by Vite's development mode just for the sake of simplicity. It's using `TypeScript` and `TailwindCSS` to create an interface to manage the file system prototype.


### Server
The `server` is a project using `Node.js` for serving an API with `Express.js` that enables the management of a mock file system. It also offers the option to run commands for managing the file system's prototype through command line.

To persist the data structure of the mock file system, this project uses `MongoDB` which is also dockerized and it's initial data is contained in the `/data` folder.


### Pre-requisites
Install `docker` and `docker-compose` on the OS


### How to Execute
Run the following command in the project's root folder:

```
docker compose up
```


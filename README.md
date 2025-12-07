# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
- Docker desktop - [Download & Install Docker desktop](https://www.docker.com/products/docker-desktop/)

## Downloading

```
git clone {repository URL}
```

## Installing NPM modules

```
npm install
```

## Generating Prisma (important!)

```
npm prisma generate
```

## Running application (with Docker + docker desktop)

```
npm run docker:up
```

## Testing

After container "home-library-rest-service" running:

```
npm run test
```

## Vulnerabilities scanning

```
npm run security:docker:check
```

## Restart docker

```
npm run docker:restart
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

## How to check restart after crash

After container "home-library-rest-service" running go to /crash route, app will stop in 3 sec and container will restart.

## How to check restart upon changes implemented into src folder

Make some changes inside any file in src folder (for example src/app.controller.ts: console.log('APP WILL CRASH IN 3 SECONDS') -> console.log('APP WILL CRASH IN 3 SECONDS!!!') ) and save file (ctrl + s). Container will restart.

## DockerHub Image

`jixlen/nodejs2025q4-service-app:latest`

Built image for this project is pushed to DockerHub - https://hub.docker.com/repository/docker/jixlen/nodejs2025q4-service-app/tags

# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
- Docker desktop - [Download & Install Docker desktop](https://www.docker.com/products/docker-desktop/)

## Downloading

```
git clone {repository URL}
```

## Changing branch

```
git checkout dev-part-3
```

## Installing NPM modules

```
npm install
```

## Generating Prisma (important!)

```
npx prisma generate
```

## Running application (with Docker + docker desktop running)

```
npm run docker:up
```

## How to check logs implementation

After container "home-library-rest-service" started you can user routes

- [localhost:4000/unexpected-500-error](localhost:4000/unexpected-500-error)
- [localhost:4000/test-logging](localhost:4000/test-logging)
- [localhost:4000/test-rotation](localhost:4000/test-rotation)
- Or use "npm run test:auth:only" to check request/respose logs

NOTE The freshest logs will be located in logs/app.log (numbers show oldest)

## ! Commands usefull for this task (Logging & Error Handling and Authentication and Authorization)

## Testing auth and refresh token

After container "home-library-rest-service" running

> This will run all the tests except refresh-token tests. Those which are not located in test/auth will fail (they will return "401 Unauthorized" because they are not using authorization and it is expected behaviour)

```
npm run test:auth
```

> This will run only tests associated with Authentication and Authorization (located in test/auth)

```
npm run test:auth:only
```

> This will run refresh-token tests

```
npm run test:refresh
```

# Others (from previous tasks)

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

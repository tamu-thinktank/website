# Local setup

**Recommended editor: [VSCode](https://code.visualstudio.com/)**

- Install all the recommended extensions

## Install [pnpm](https://pnpm.io/installation)

- Installation:
  - Windows Powershell:

    ```pwsh
    $env:PNPM_VERSION="9.0.4"
    iwr https://get.pnpm.io/install.ps1 -useb | iex
    ```

  - POSIX:

    ```sh
    curl -fsSL https://get.pnpm.io/install.sh | env PNPM_VERSION="9.0.4" sh -
    ```

  - Test if installed with `pnpm -v`, else restart computer

- Install nodejs (if not already installed):

  ```pwsh
  pnpm env use --global lts
  ```

  - Should be using LTS version `18.16.1` or higher
  - Install nodejs from its website if this command doesn't work

- Install node-gyp (if you installed nodejs from pnpm):

  ```pwsh
  pnpm i -g node-gyp
  ```

- Install dependencies:

  ```pwsh
  pnpm i
  ```

## Filling up environment variables

- Create empty .env file from .env.example template:

  ```pwsh
  cp .env.example .env
  ```

- Below sections are steps for populating variables in .env file with your unique values

### POSTGRES_PRISMA_URL and POSTGRES_URL_NON_POOLING

- from Vercel serverless postgres

#### Local database

- using Docker (recommended for development b/c fast and easy to reset database)
- Install [Docker Desktop](https://docs.docker.com/desktop/install/windows-install/)
- Create an account on [Docker Hub](https://hub.docker.com/)
- Launch Docker Desktop and login
- Open terminal in the 'dashboard' folder, run command to start database:

  ```pwsh
  docker-compose up
  ```

  - (stays open until you close it in terminal)
  - can add `-d` at the end for detached mode, which runs in background so you can keep using terminal
  - it finds the `docker-compose.yml` file in the working directory and runs it
  - will install postgres image if not already installed and run it in a container
  - can see installed image, running container, and volume (storage) in Docker Desktop or CLI

- can stop container with `docker-compose stop`
- can start existing container with `docker-compose start` (detached mode by default)
- `POSTGRES_PRISMA_URL`: already copied from .env.example for docker database
- to reset database:
  - delete container: `docker-compose down`
  - delete the volume (storage) with `docker volume rm dashboard_db`
- can also delete postgres image with `docker rmi postgres` (will need to delete all containers using it first)

### NEXTAUTH_SECRET

- Generate a random string
  - Run `openssl rand -base64 32` in Ubuntu to generate a random string or use [this website](https://generate-secret.now.sh/32)

### Auth0 variables

- Create account on [Auth0](https://auth0.com/)
- Create regular web app → nextjs app
  - If you're already on the homepage, Sidebar: Applications → Applications → create new app → select regular web applications
- Sidebar: Applications → Applications → your app
- Copy `Domain` to `AUTH0_ISSUER`, add `https://` in front of the URL
- Copy `Client ID` to `AUTH0_CLIENT_ID`
- Copy `Client Secret` to `AUTH0_CLIENT_SECRET`
- Go back to Auth0 website
- Paste `http://localhost:3000/api/auth/callback/auth0` in `Allowed Callback URLs` textbox
- Paste `http://localhost:3000/` in `Allowed Logout URLs` textbox (below `Allowed Callback URLs`)
- Save changes button

## Project database setup

- Push our database schema to your database server:

  ```pwsh
  pnpm prisma db push
  ```

- If weird type/syntax errors (VSCode):
  - ctrl+shift+p → restart ts server
  - ctrl+shift+p → restart eslint server

- If prisma CLI errors, close dev server and retry command

- To view database locally:

  ```pwsh
  pnpm prisma studio
  ```

  - (stays open until you close it in terminal)

## Running website locally

```pwsh
pnpm dev
```

- URL to view site: `http://localhost:3000/`
# Force CI rerun

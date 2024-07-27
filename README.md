A concert management web application useful for organizations hosting Indian Classical Music concerts. It can also be adapted for any event management usage.

The name Baithak literally means "seat" or "sitting down", which is how the artists perform in Indian Classical Music concerts.

This application uses [Exograph](https://exograph.dev) for backend, [Next.js](https://nextjs.org/) along with [React](https://react.dev/) and [Tailwind](https://tailwindcss.com/) for frontend, and [Clerk](https://clerk.com/) for authentication.

## Prerequisites

- [Exograph](https://exograph.dev/docs/getting-started#install-exograph)
- [PostgreSQL](https://www.postgresql.org/download/) or [Docker](https://www.docker.com/products/docker-desktop). You may also use a managed Postgres service such as [Neon](https://neon.tech/).
- [Node.js](https://nodejs.org/en/download/)

## Getting started

1. Clone this repository
2. Clone https://github.com/basant-bahar/upload-server
3. Create a Clerk project by following their [instructions](https://clerk.com/docs/quickstarts/setup-clerk)

## Launch the backend

### Customize environment variables

Copy `.env.template` file to `.env.local` and follow instrucions in it to customize.

```bash
cp .env.template .env.local
```

### Start the backend server

Open a new terminal window and run the following commands:

```bash
cd api
source .env.local
exo yolo
```

This will run the server in the [yolo mode](https://exograph.dev/docs/cli-reference/development/yolo). This creates a temporary database that lasts while the command is running. Therefore, once you get everything working, you should switch to the [dev mode](https://exograph.dev/docs/cli-reference/development/dev).

## Launch file upload server

Open a new terminal, change to the directory where you cloned the repository, and follow instructions in the [upload-server repository](https://github.com/basant-bahar/upload-server).

## Launch the frontend
Open a new terminal window and run the following commands:

```bash
cd web
npm install
```

### Customize environment variable

Copy `.env.local.template` file to `.env.local` and follow instrucions in it to customize.

```bash
cp .env.local.template .env.local
```

### Run the frontend server:

```bash
NEXT_PUBLIC_API_URL=http://localhost:9876/graphql npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

You can deploy the backend to any of the cloud providers by following instructions in [Exograph documentation](https://exograph.dev/docs/deployment).

You can deploy the frontend as well as the upload server to any of the cloud providers by following instructions in [Next.js documentation](https://nextjs.org/docs/app/building-your-application/deploying).

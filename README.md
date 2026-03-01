# OffTrack - Edge Framework

OffTrack is a robust base framework for offline developments, combining the simplicity of PocketBase with the power of GraphQL and a premium TanStack-powered React frontend.

## Features

- **Embedded PocketBase**: A powerful, lightweight backend embedded as a Go library.
- **Dual API Support**:
  - **REST**: Standard PocketBase REST API.
  - **GraphQL**: Custom GraphQL API via `gqlgen` at `/graphql`.
- **Embedded Frontend**:
  - Premium React dashboard using **TanStack Router** and **TanStack Query**.
  - No separate deployment needed; the frontend is bundled directly into the Go binary using the `embed` package.
- **SPA Fallback**: Custom Go middleware handles client-side routing, making it feel like a native desktop app.
- **Offline First**: Designed to run locally with zero dependencies (just one binary).

## Getting Started

### Prerequisites

- Go 1.25+
- Node.js (for frontend development only)

### Running the App

Download or build the binary and run:

```bash
./offtrack serve
```

Access the dashboard at [http://127.0.0.1:8090/](http://127.0.0.1:8090/).

### Development

#### Backend (Go)

Modify `main.go` or the GraphQL schema in `graph/`. Rebuild the binary with:

```bash
go build -o offtrack main.go
```

#### Frontend (React)

Located in the `ui/` directory.

```bash
cd ui
npm install
npm run dev
```

The dev server proxies API calls to port 8090 by default.

## Deployment

To create a single production binary:

1. Build the frontend: `cd ui && npm run build`
2. Build the Go binary: `go build -o offtrack main.go`

The `offtrack` binary is now a self-contained web application.

## Tech Stack

- **Backend**: [PocketBase](https://pocketbase.io/)
- **GraphQL**: [gqlgen](https://gqlgen.com/)
- **Frontend Framework**: [React](https://reactjs.org/)
- **Frontend Tooling**: [Vite](https://vitejs.dev/)
- **Routing**: [TanStack Router](https://tanstack.com/router)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query)
- **Icons**: [Lucide React](https://lucide.dev/)

# 2024 I.C.E. Robotics Scouting App

This repository houses a React progressive web app serving as the offline-first scouting app custom designed for use by I.C.E. Robotics in the 2025 FIRST Tech Challenge game, Into the Deep.

## Development Instructions

Message @liujip0 on Discord if you have any questions.

### 1. Clone the repo locally

Use either GitHub CLI:

```zsh
gh repo clone liujip0/scouting
```

or git:

```zsh
git clone https://github.com/liujip0/scouting.git
```

### 2. Navigate to scouting directory

```zsh
cd ice-scout
```

### 3. Install dependencies

```zsh
pnpm install
```

### 4. Add environment variables

Create a file called `.env.local` in `app/src/`

```env
VITE_SERVER_URL="http://localhost:8788"
```

Create a file called `.dev.vars` in `api/`

```env
ADMIN_ACCOUNT_USERNAME="admin"
ADMIN_ACCOUNT_PASSWORD="adminpassword"

FIRST_API_TOKEN=<Direct message @liujip0 on Discord>
TBA_API_TOKEN=<Direct message @liujip0 on Discord>

JWT_PRIVATE_KEY="xc03o1xblf4rga87xss3ebztlc8f5r9l"
```

### 5. Initialize local database

Change to `api/` folder

```zsh
cd api
```

Initialize local database

```zsh
npx wrangler d1 execute ice-scout-db --file=./migrations/0000_initialize.sql
```

Return to original folder

```zsh
cd ..
```

### 6. Run local development server

```zsh
pnpm dev
```

The frontend will be on `localhost:5174` and the backend will be on `localhost:8788`.

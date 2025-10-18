Running tests

This project includes a small integration test using Jest + Supertest that hits the running Next.js dev server.

Prerequisites:
- Node.js installed
- Project dependencies installed: npm install
- A running development server with environment variables set (Supabase URL, keys) because the API routes use Supabase.

Quick steps:

1. Install dependencies

```powershell
npm install
```

2. Start the dev server in another terminal

```powershell
npm run dev
```

3. Run tests

```powershell
npm test
```

Notes:
- The tests assume the dev server is reachable at http://localhost:3000.
- If your dev server uses a different port, update the test url in `tests/api/comments.test.ts`.
- The tests are smoke tests and may need environment configuration (SUPABASE keys) to return ok responses.

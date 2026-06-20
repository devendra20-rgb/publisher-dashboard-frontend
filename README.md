# Publisher Dashboard Frontend

React, TypeScript, Vite, TanStack Query, React Hook Form, Zod, Axios, and Tailwind CSS frontend.

Active modules:

- Authentication and profile
- Role-specific dashboard and sidebar
- Publisher List, Create, Edit, and Details
- Offer List, Create, Edit, and Details
- Admin-only Payment Information inside Offer Details
- Admin User management
- Admin Excel reports

Publisher and Offer forms are completely separate. There is no Record form or Payment page.

See the authoritative architecture and permission specification in the repository root [README.md](../README.md).

## Development

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env` and set `VITE_API_URL`.

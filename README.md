# Polar better auth
The main purpose of this repository is to demonstrate how to integrate payments (Polar) and authentication (better-auth) in a straightforward way.

A [live example](https://polar-better-auth.vercel.app/) is available.

This project uses the following technologies:

*   Next.js 15.3
*   [Polar](https://polar.sh/) for payments
*   [better-auth](https://www.better-auth.com/) for authentication
    *   [Next.js integration guide](https://www.better-auth.com/docs/integrations/next)
*   [Neon](https://neon.tech/) for the database

## Migration

To run database migrations, use the better-auth CLI:

```bash
npx @better-auth/cli migrate
```
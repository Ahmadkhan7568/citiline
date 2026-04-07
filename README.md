This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page## 🚀 Production Deployment (Vercel + Supabase)

To get this platform live, follow these final steps:

1.  **Database Sync**: Ensure you have run `npx drizzle-kit push` with your `DATABASE_URL` in `.env.local` to sync the schema to Supabase.
2.  **Vercel Configuration**:
    - Connect this repository to Vercel.
    - Add the following **Environment Variables**:
      - `DATABASE_URL`: Your Supabase connection string.
3.  **Build**: Vercel will automatically detect the Next.js project and deploy it.

## 🛠️ Management Access
- **Admin Panel**: `/admin`
- **User Dashboard**: `/dashboard`
- **Auth**: `/login` / `/register`
.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

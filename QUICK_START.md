# Quick Start Guide - Kulmiye Data

Get the app running in 5 minutes! ⚡

## Prerequisites

- Node.js 18+ installed
- PostgreSQL running locally or cloud database URL ready

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Database

Create a PostgreSQL database:
```sql
CREATE DATABASE kulmiye_data;
```

### 3. Configure Environment

Copy and edit the environment file:
```bash
cp .env.example .env
```

**Update `.env` with your database URL:**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/kulmiye_data"
NEXTAUTH_SECRET="run: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Initialize Database

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

### 5. Start Development Server

```bash
npm run dev
```

### 6. Open & Login

- Open: http://localhost:3000
- **Login with**:
  - Phone: `252612345678`
  - Password: `password123`

## 🎉 That's it!

You now have a fully functional mobile data management app running locally.

## What to Do Next?

1. **Explore the Dashboard** - See your balance and data
2. **Browse Data Bundles** - Check out available packages
3. **Try Top-Up** - Add funds to your account
4. **Purchase a Bundle** - Buy some data
5. **View Transactions** - See your transaction history

## Troubleshooting

**Can't connect to database?**
```bash
# Check PostgreSQL is running
sudo service postgresql status
```

**Port 3000 in use?**
```bash
# Use different port
PORT=3001 npm run dev
```

**Need to reset everything?**
```bash
npm run db:push --force-reset
npm run db:seed
```

## Production Deployment

### Quick Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

### Environment Variables for Production

Set these in your hosting platform:
- `DATABASE_URL` - Your production database URL
- `NEXTAUTH_SECRET` - A secure random string
- `NEXTAUTH_URL` - Your production domain

## Need Help?

- 📖 Read [README.md](README.md) for full documentation
- 🛠️ Read [SETUP.md](SETUP.md) for detailed setup guide
- 📋 Read [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) for project overview

---

Happy coding! 🚀

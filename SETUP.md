# Kulmiye Data - Setup Guide

This guide will help you set up the Kulmiye Data application on your local machine or server.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **PostgreSQL** 14.x or higher ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/downloads))
- A code editor (VS Code recommended)

## Step-by-Step Installation

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd kulmiye-data
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js 14
- Prisma
- NextAuth.js
- Tailwind CSS
- And all other dependencies

### 3. Set Up PostgreSQL Database

#### Option A: Local PostgreSQL

1. Create a new database:
```sql
CREATE DATABASE kulmiye_data;
```

2. Create a database user (optional but recommended):
```sql
CREATE USER kulmiye_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE kulmiye_data TO kulmiye_user;
```

#### Option B: Cloud Database (Supabase, Railway, etc.)

1. Sign up for a free PostgreSQL database
2. Copy the connection string provided

### 4. Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` file with your actual values:

```env
# Database - Update with your PostgreSQL connection string
DATABASE_URL="postgresql://kulmiye_user:your_secure_password@localhost:5432/kulmiye_data?schema=public"

# NextAuth - Generate a random secret
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-here-min-32-chars"

# App Configuration
NEXT_PUBLIC_APP_NAME="Kulmiye Data"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Important**: To generate a secure `NEXTAUTH_SECRET`, run:
```bash
openssl rand -base64 32
```

### 5. Set Up the Database Schema

```bash
# Generate Prisma Client
npm run db:generate

# Push the schema to your database
npm run db:push
```

### 6. Seed the Database

Populate your database with sample data:

```bash
npm run db:seed
```

This will create:
- 1 demo user account
- 11 data bundles (daily, weekly, monthly, special)
- 2 sample transactions
- 3 service plans

### 7. Run the Development Server

```bash
npm run dev
```

The application will be available at: [http://localhost:3000](http://localhost:3000)

### 8. Access the Application

Use these demo credentials to login:
- **Phone**: 252612345678
- **Password**: password123

## Production Deployment

### Building for Production

```bash
npm run build
npm run start
```

### Environment Variables for Production

Update your `.env` for production:

```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="different-super-secret-key-for-production"
```

### Deployment Platforms

#### Vercel (Recommended for Next.js)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Add environment variables in Vercel dashboard

#### Other Platforms

The app can be deployed to:
- **Railway** - Easy PostgreSQL + Next.js hosting
- **Render** - Free tier available
- **DigitalOcean App Platform**
- **AWS Amplify**
- **Heroku**

## Troubleshooting

### Database Connection Issues

**Error**: `Can't reach database server`

**Solution**:
1. Check PostgreSQL is running:
```bash
# On Linux/Mac
sudo systemctl status postgresql
# or
brew services list

# On Windows
services.msc (check PostgreSQL service)
```

2. Verify connection string in `.env`
3. Test connection:
```bash
psql -h localhost -U kulmiye_user -d kulmiye_data
```

### Prisma Client Issues

**Error**: `@prisma/client did not initialize yet`

**Solution**:
```bash
npm run db:generate
```

### Port Already in Use

**Error**: `Port 3000 is already in use`

**Solution**:
```bash
# Use a different port
PORT=3001 npm run dev

# Or kill the process using port 3000
# On Mac/Linux
lsof -ti:3000 | xargs kill -9
# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Build Errors

**Error**: TypeScript or ESLint errors

**Solution**:
```bash
# Clear Next.js cache
rm -rf .next

# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

## Database Management

### View Database in Prisma Studio

```bash
npm run db:studio
```

This opens a GUI at `http://localhost:5555` to view and edit your database.

### Reset Database

```bash
# Warning: This deletes all data!
npx prisma migrate reset
npm run db:seed
```

### Create Database Backup

```bash
pg_dump -U kulmiye_user kulmiye_data > backup.sql
```

### Restore Database

```bash
psql -U kulmiye_user kulmiye_data < backup.sql
```

## Development Tips

### Hot Reload

The development server supports hot reload. Changes to files will automatically refresh the browser.

### Database Schema Changes

When you modify `prisma/schema.prisma`:

1. Generate new Prisma client:
```bash
npm run db:generate
```

2. Push changes to database:
```bash
npm run db:push
```

Or create a migration:
```bash
npm run db:migrate
```

### Adding New API Routes

Create files in `src/app/api/` directory following Next.js 14 App Router conventions.

### Adding New Pages

Create files in `src/app/` directory with `page.tsx` naming convention.

## Testing

### Manual Testing Checklist

- [ ] User registration works
- [ ] User login works
- [ ] Dashboard displays correctly
- [ ] Data bundles page loads
- [ ] Bundle purchase works
- [ ] Top-up functionality works
- [ ] Transaction history shows correctly
- [ ] Profile page displays user info
- [ ] Mobile responsive design works
- [ ] Logout works

### Test Payment Flow

1. Register a new account
2. Top-up with $50
3. Purchase a data bundle
4. Check transaction history
5. Verify balance updates

## Security Checklist

For production deployment:

- [ ] Change `NEXTAUTH_SECRET` to a strong random value
- [ ] Use strong database password
- [ ] Enable SSL for database connection
- [ ] Set up HTTPS for your domain
- [ ] Implement rate limiting on API routes
- [ ] Add CORS configuration if needed
- [ ] Review and update CSRF protection
- [ ] Enable database backups
- [ ] Set up monitoring and logging
- [ ] Review user permissions

## Getting Help

If you encounter issues:

1. Check this setup guide
2. Review the main README.md
3. Check Prisma documentation: https://www.prisma.io/docs
4. Check Next.js documentation: https://nextjs.org/docs
5. Open an issue on GitHub

## Next Steps

After successful setup:

1. Customize the branding (colors, logo, name)
2. Configure real payment gateway integration
3. Set up email/SMS notifications
4. Add more data bundles and service plans
5. Implement analytics and monitoring
6. Add more features based on your requirements

---

Happy coding! 🚀

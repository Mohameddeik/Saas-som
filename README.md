# Kulmiye Data - Mobile Data Management App

A modern web application for managing mobile data subscriptions, bundles, and account balances. Built with Next.js 14, TypeScript, Prisma, and PostgreSQL.

## Features

- 🔐 **User Authentication** - Secure login and registration with phone numbers
- 💰 **Account Balance** - Track and manage account balance
- 📊 **Data Management** - Monitor data usage and balance
- 🛒 **Data Bundles** - Purchase daily, weekly, and monthly data bundles
- 💳 **Top-Up** - Add funds via multiple payment methods (Zaad, EVC Plus, eDahab, Card)
- 📜 **Transaction History** - View all transactions and purchases
- 👤 **User Profile** - Manage account information
- 📱 **Mobile Responsive** - Fully responsive design for all devices

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd kulmiye-data
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your database connection string and other variables.

4. Set up the database:
```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:push

# Seed the database with sample data
npm run db:seed
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Credentials

After seeding the database, you can login with:
- **Phone**: 252612345678
- **Password**: password123

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard page
│   ├── bundles/           # Data bundles page
│   ├── transactions/      # Transaction history
│   ├── topup/             # Top-up page
│   └── profile/           # User profile
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── Layout/           # Layout components
├── lib/                   # Utility functions
│   ├── prisma.ts         # Prisma client
│   ├── auth.ts           # Auth configuration
│   └── utils.ts          # Helper functions
└── types/                 # TypeScript type definitions

prisma/
├── schema.prisma         # Database schema
└── seed.ts              # Database seed script
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed database with sample data

## Features in Detail

### Authentication
- Phone number-based authentication
- Secure password hashing with bcrypt
- Session management with JWT tokens
- Protected routes with middleware

### Data Bundles
- Multiple bundle categories (Daily, Weekly, Monthly, Special)
- Featured bundles highlighting
- Real-time purchase processing
- Automatic balance deduction

### Top-Up System
- Multiple payment methods support
- Quick amount selection
- Custom amount input
- Instant balance update

### Transaction History
- Complete transaction log
- Transaction type filtering
- Status indicators
- Balance tracking

## Database Schema

The application uses the following main models:

- **User** - User accounts and authentication
- **DataBundle** - Available data packages
- **DataPurchase** - User bundle purchases
- **Transaction** - All financial transactions
- **ServicePlan** - Voice/SMS service plans
- **UserSubscription** - Active service subscriptions

## Payment Methods Supported

- Zaad Service
- EVC Plus
- eDahab
- Credit/Debit Card

## Security Features

- Password hashing with bcrypt
- JWT-based session management
- Protected API routes
- Input validation and sanitization
- CSRF protection

## Mobile Responsiveness

The application is fully responsive with:
- Mobile-first design approach
- Bottom navigation for mobile devices
- Collapsible sidebar for tablets/desktop
- Touch-friendly UI elements

## Future Enhancements

- [ ] Two-factor authentication
- [ ] Real payment gateway integration
- [ ] Push notifications
- [ ] Data usage analytics
- [ ] Referral system
- [ ] Multi-language support
- [ ] Dark mode
- [ ] SMS/Email notifications

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For support, email support@kulmiyedata.com or join our Slack channel.

---

Built with ❤️ for the Somali telecom market

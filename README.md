# Study Room Booking System - Setup Guide

This guide will help you set up and run the Study Room Booking System on your computer after obtaining the code.

## Prerequisites

Before starting, make sure you have the following installed:

- Node.js (version 18 or higher)
- npm (comes with Node.js)
- PostgreSQL (or another database supported by Prisma)

## Step 1: Clone the Repository

Download or clone the code repository to your local machine.

```bash
git clone [https://github.com/Tumi-bit/study-room-booking.git]
cd study-room-booking
```

## Step 2: Install Dependencies

Install all required packages by running:

```bash
npm install
```

This may take a few minutes to complete.

## Step 3: Set Up Environment Variables

Create a `.env.local` file in the project root directory with the following content:

```
# Database connection
DATABASE_URL="postgresql://username:password@localhost:5432/studyrooms"

# NextAuth configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-random-string-here"
```

Replace the database connection string with your own database credentials.

Generate a secure random string for `NEXTAUTH_SECRET` with:

```bash
openssl rand -base64 32
```

## Step 4: Set Up the Database

1. Create a new PostgreSQL database named "studyrooms" (or use the name you specified in the connection string).

2. Push the database schema to your database:

```bash
npx prisma db push
```

3. (Optional) Seed the database with initial data:

```bash
npx prisma db seed
```

If you encounter any errors with the seed command, you can try:

```bash
npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
```

## Step 5: Start the Development Server

Launch the application in development mode:

```bash
npm run dev
```

The server should start, and you'll see a message indicating it's running at http://localhost:3000.

## Step 6: Create a User Account

1. Open your browser and navigate to http://localhost:3000
2. Click on "Registrieren" to create a new account
3. Fill in your name, email, and password
4. Log in with your new credentials

## Step 7: Using the Application

After logging in, you can:

- Browse available study rooms
- Filter rooms by location, size, and equipment
- Book a room by selecting a date and time
- View and manage your bookings
- Cancel bookings you no longer need

## Troubleshooting

### Database Connection Issues

If you encounter database connection problems:

1. Verify your database is running
2. Check that the connection string in `.env.local` is correct
3. Ensure your database user has the necessary permissions

### Authentication Problems

If you experience authentication errors:

1. Make sure `NEXTAUTH_SECRET` is set properly
2. Check that `NEXTAUTH_URL` matches your development server URL
3. Restart the server after making changes to these values

### Dependency Conflicts

If you encounter package dependency conflicts, try installing with:

```bash
npm install --legacy-peer-deps
```

### Prisma Client Generation

If you modify the database schema and encounter errors, regenerate the Prisma client:

```bash
npx prisma generate
```

## Next Steps

For production deployment:

1. Set up environment variables on your hosting platform
2. Build the production version: `npm run build`
3. Start the production server: `npm start`

## Support

For additional help or questions, please refer to the project documentation or contact the development team.
README.md
Displaying README.md.

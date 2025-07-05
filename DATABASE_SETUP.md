# Database Setup Guide

## Option 1: Supabase (Recommended)

Since you already have Supabase configured, here's how to set up the database:

### 1. Install Supabase CLI
```bash
npm install -g supabase
```

### 2. Create Database Tables

Run these SQL commands in your Supabase dashboard:

```sql
-- Volunteers table
CREATE TABLE volunteers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  assigned_duty JSONB,
  status VARCHAR(20) DEFAULT 'active',
  join_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Participants table
CREATE TABLE participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  registration_time TIMESTAMP DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'registered',
  qr_code VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Scan logs table
CREATE TABLE scan_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_id UUID REFERENCES participants(id),
  volunteer_id UUID REFERENCES volunteers(id),
  scan_time TIMESTAMP DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'success',
  message TEXT
);
```

### 3. Update API Routes

Replace the mock data in your API routes with Supabase queries:

```typescript
// Example: src/app/api/participants/route.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from('participants')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ participants: data });
}
```

## Option 2: PostgreSQL with Prisma

### 1. Install Prisma
```bash
npm install prisma @prisma/client
npx prisma init
```

### 2. Configure Database Schema
Create `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Volunteer {
  id           String   @id @default(cuid())
  name         String
  email        String   @unique
  phone        String?
  assignedDuty Json?
  status       String   @default("active")
  joinDate     DateTime @default(now())
  createdAt    DateTime @default(now())
  scanLogs     ScanLog[]
}

model Participant {
  id               String    @id @default(cuid())
  name             String
  email            String
  phone            String?
  registrationTime DateTime  @default(now())
  status           String    @default("registered")
  qrCode           String    @unique
  createdAt        DateTime  @default(now())
  scanLogs         ScanLog[]
}

model ScanLog {
  id           String      @id @default(cuid())
  participant  Participant @relation(fields: [participantId], references: [id])
  participantId String
  volunteer    Volunteer?  @relation(fields: [volunteerId], references: [id])
  volunteerId  String?
  scanTime     DateTime    @default(now())
  status       String      @default("success")
  message      String?
}
```

### 3. Generate and Run Migrations
```bash
npx prisma generate
npx prisma db push
```

## Option 3: MongoDB with Mongoose

### 1. Install Dependencies
```bash
npm install mongoose
```

### 2. Create Models
Create `src/models/Volunteer.ts`:

```typescript
import mongoose from 'mongoose';

const volunteerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  assignedDuty: Object,
  status: { type: String, default: 'active' },
  joinDate: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.Volunteer || mongoose.model('Volunteer', volunteerSchema);
```

## Environment Variables

Add these to your `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# PostgreSQL
DATABASE_URL="postgresql://username:password@localhost:5432/janmashtami"

# MongoDB
MONGODB_URI=mongodb://localhost:27017/janmashtami
```

## Testing Your Backend

1. Start your development server:
```bash
npm run dev
```

2. Test API endpoints:
```bash
# Get all participants
curl http://localhost:3000/api/participants

# Create a participant
curl -X POST http://localhost:3000/api/participants \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","phone":"+1234567890"}'

# Process a scan
curl -X POST http://localhost:3000/api/scan \
  -H "Content-Type: application/json" \
  -d '{"qrCode":"1","volunteerId":"volunteer1"}'
```

## Next Steps

1. Choose your preferred database option
2. Set up the database and tables
3. Update the API routes to use real database queries
4. Add authentication and authorization
5. Implement real-time updates using WebSockets or Server-Sent Events
6. Add data validation and error handling
7. Set up backup and monitoring 
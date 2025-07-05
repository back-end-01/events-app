# Janmashtami Celebration PWA

A Progressive Web App for managing Janmashtami celebrations with participant registration and volunteer management.

## Features

- **PWA Support**: Installable app with offline capabilities
- **Participant Registration**: Complete registration form with validation
- **Volunteer Management**: Dashboard for event volunteers
- **Google Authentication**: Secure sign-in with NextAuth.js
- **Responsive Design**: Beautiful UI optimized for mobile devices
- **Real-time Updates**: Live data synchronization

## Pages Structure

1. **Screen 0 (Home)**: Choose between Participate or Volunteer
2. **Page 1 (Events)**: Event information and details
3. **Page 3 (Signup)**: Participant registration form
4. **Volunteer Dashboard**: Management interface for volunteers

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Authentication**: NextAuth.js with Google OAuth
- **Backend**: Supabase (PostgreSQL)
- **PWA**: next-pwa

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Cloud Console account
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd janmashtami_app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# Google OAuth (Get from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Supabase Configuration (Get from Supabase Dashboard)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Set authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to `.env.local`

### Supabase Setup

1. Create a new project at [Supabase](https://supabase.com/)
2. Get your project URL and anon key from Settings → API
3. Create the following tables in your Supabase database:

#### Participants Table
```sql
CREATE TABLE participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  age TEXT NOT NULL,
  address TEXT,
  emergency_contact TEXT,
  dietary_restrictions TEXT,
  special_needs TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Volunteers Table
```sql
CREATE TABLE volunteers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  tasks TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Events Table
```sql
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  venue TEXT NOT NULL,
  description TEXT,
  capacity INTEGER NOT NULL,
  registered_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

3. For PWA testing:
   - Use Chrome DevTools
   - Go to Application tab
   - Check "Service Workers" and "Manifest"

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── events/            # Events page
│   ├── signup/            # Registration page
│   ├── success/           # Success page
│   ├── volunteer/         # Volunteer dashboard
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   └── AuthProvider.tsx   # NextAuth provider
├── lib/                   # Utility functions
│   └── supabase.ts        # Supabase client
public/
├── manifest.json          # PWA manifest
└── icons/                 # PWA icons
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform

## PWA Features

- **Installable**: Users can install the app on their devices
- **Offline Support**: Basic offline functionality
- **Push Notifications**: Event reminders (to be implemented)
- **App-like Experience**: Full-screen mode, custom icons

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@janmashtami-app.com or create an issue in the repository.

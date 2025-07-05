-- Janmashtami App Database Setup
-- Run these commands in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Volunteers table
CREATE TABLE IF NOT EXISTS volunteers (
  id text PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  assigned_duty JSONB,
  status VARCHAR(20) DEFAULT 'active',
  join_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Participants table
CREATE TABLE IF NOT EXISTS participants (
  id text PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  registration_time TIMESTAMP DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'registered',
  qr_code VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Scan logs table
CREATE TABLE IF NOT EXISTS scan_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  participant_id UUID REFERENCES participants(id) ON DELETE CASCADE,
  volunteer_id UUID REFERENCES volunteers(id) ON DELETE SET NULL,
  scan_time TIMESTAMP DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'success',
  message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Volunteer Applications table
CREATE TABLE IF NOT EXISTS volunteer_applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  duty_id TEXT NOT NULL,
  reason TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample data
INSERT INTO volunteers (name, email, phone, assigned_duty) VALUES
('John Doe', 'john@example.com', '+91 98765 43210', '{"id": "1", "title": "Scanning Desk Management", "description": "Manage QR code scanning for participant check-ins", "location": "Main Entrance", "status": "assigned", "priority": "high", "route": "/volunteer/scanning", "icon": "📱", "shift": "6:00 PM - 10:00 PM"}'),
('Jane Smith', 'jane@example.com', '+91 98765 43211', '{"id": "2", "title": "Registration Desk", "description": "Handle participant registrations", "location": "Registration Area", "status": "assigned", "priority": "high", "route": "/volunteer/registration", "icon": "📝", "shift": "5:00 PM - 9:00 PM"}');

INSERT INTO participants (name, email, phone, qr_code) VALUES
('Rahul Sharma', 'rahul@example.com', '+91 98765 43210', '1'),
('Priya Patel', 'priya@example.com', '+91 98765 43211', '2'),
('Amit Kumar', 'amit@example.com', '+91 98765 43212', '3'),
('Neha Singh', 'neha@example.com', '+91 98765 43213', '4'),
('Vikram Malhotra', 'vikram@example.com', '+91 98765 43214', '5'),
('Anjali Gupta', 'anjali@example.com', '+91 98765 43215', '6'),
('Suresh Reddy', 'suresh@example.com', '+91 98765 43216', '7'),
('Meera Iyer', 'meera@example.com', '+91 98765 43217', '8');

-- Create indexes for better performance
CREATE INDEX idx_participants_qr_code ON participants(qr_code);
CREATE INDEX idx_participants_status ON participants(status);
CREATE INDEX idx_scan_logs_participant_id ON scan_logs(participant_id);
CREATE INDEX idx_scan_logs_volunteer_id ON scan_logs(volunteer_id);
CREATE INDEX idx_scan_logs_scan_time ON scan_logs(scan_time);

-- Enable Row Level Security (RLS)
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteer_applications ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your authentication needs)
CREATE POLICY "Allow all operations for authenticated users" ON volunteers
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON participants
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON scan_logs
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow all operations for authenticated users" ON volunteer_applications
  FOR ALL USING (auth.role() = 'authenticated'); 
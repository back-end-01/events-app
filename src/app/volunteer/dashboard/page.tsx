'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Duty } from '../../../types/volunteer';
import VolunteersRealtime from '../../../components/VolunteersRealtime';
import { useEffect, useState } from 'react';

export default function VolunteerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isVolunteer, setIsVolunteer] = useState<boolean | null>(null);

  useEffect(() => {
    if (status !== 'loading' && !session) {
      router.push('/auth/signin?role=volunteer');
    }
  }, [session, status, router]);

  useEffect(() => {
    const checkVolunteer = async () => {
      if (session?.user?.email) {
        const res = await fetch(`/api/volunteers/me`);
        if (res.ok) {
          const data = await res.json();
          setIsVolunteer(data.isVolunteer);
        } else {
          setIsVolunteer(false);
        }
      }
    };
    if (session?.user?.email) {
      checkVolunteer();
    }
  }, [session]);

  // Mock duty assignment - in real app, this would come from database
  const assignedDuty: Duty = {
    id: '1',
    title: 'Scanning Desk Management',
    description: 'Manage QR code scanning for participant check-ins',
    location: 'Main Entrance',
    status: 'assigned',
    priority: 'high',
    route: '/volunteer/scanning',
    icon: '📱',
    shift: '6:00 PM - 10:00 PM'
  };

  if (status === 'loading' || isVolunteer === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  if (!isVolunteer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="bg-white/10 p-8 rounded-xl text-center">
          <h2 className="text-2xl font-bold text-white mb-4">You are not yet a volunteer.</h2>
          <p className="text-blue-200 mb-6">Please apply for a duty to become a volunteer.</p>
          <button
            onClick={() => router.push('/volunteer/apply')}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Apply to Volunteer
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Registrations', value: '247', icon: '👥' },
    { label: 'Volunteers', value: '12', icon: '🤝' },
    { label: 'Tasks Completed', value: '8', icon: '✅' },
    { label: 'Pending Tasks', value: '3', icon: '⏳' }
  ];

  const tasks = [
    { id: 1, title: 'Setup Decoration', status: 'completed', priority: 'high' },
    { id: 2, title: 'Manage Registration Desk', status: 'in-progress', priority: 'high' },
    { id: 3, title: 'Coordinate Food Distribution', status: 'pending', priority: 'medium' },
    { id: 4, title: 'Assist with Cultural Programs', status: 'pending', priority: 'low' }
  ];

  const handleDutyAction = (duty: Duty) => {
    router.push(duty.route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-sm p-4"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-2xl">🕉️</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Volunteer Dashboard</h1>
              <p className="text-blue-200">Welcome, {session.user?.name}</p>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto p-4">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center"
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-blue-200 text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Assigned Duty */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-yellow-400/30"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{assignedDuty.icon}</div>
              <div>
                <h2 className="text-2xl font-bold text-white">Your Assigned Duty</h2>
                <p className="text-blue-200">You have been assigned to manage the scanning desk</p>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-medium ${
              assignedDuty.status === 'completed' ? 'bg-green-500/20 text-green-300' :
              assignedDuty.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-300' :
              'bg-blue-500/20 text-blue-300'
            }`}>
              {assignedDuty.status.replace('-', ' ')}
            </div>
          </div>
          
          <div className="bg-white/5 rounded-lg p-4 mb-4">
            <h3 className="text-xl font-semibold text-white mb-2">{assignedDuty.title}</h3>
            <p className="text-blue-200 mb-3">{assignedDuty.description}</p>
            <div className="flex items-center justify-between">
              <div className="text-blue-200 text-sm">
                <span className="font-medium">Location:</span> {assignedDuty.location}
              </div>
              <button
                onClick={() => handleDutyAction(assignedDuty)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
              >
                Start Duty
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">General Tasks</h2>
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white/5 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${
                    task.priority === 'high' ? 'bg-red-500' :
                    task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></div>
                  <div>
                    <h3 className="text-white font-semibold">{task.title}</h3>
                    <p className="text-blue-200 text-sm capitalize">
                      Priority: {task.priority}
                    </p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  task.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                  task.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-300' :
                  'bg-gray-500/20 text-gray-300'
                }`}>
                  {task.status.replace('-', ' ')}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid md:grid-cols-2 gap-6"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={() => handleDutyAction(assignedDuty)}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-4 rounded-lg transition-colors font-semibold"
              >
                {assignedDuty.icon} Go to Scanning Desk
              </button>
              <button 
                onClick={() => router.push('/volunteer/qr-generator')}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded-lg transition-colors"
              >
                📱 Generate Test QR Codes
              </button>
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg transition-colors">
                View Participant List
              </button>
              <button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg transition-colors">
                Mark Task Complete
              </button>
              <button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded-lg transition-colors">
                Send Notifications
              </button>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Event Info</h3>
            <div className="space-y-3 text-blue-200">
              <div className="flex justify-between">
                <span>Date:</span>
                <span>August 26, 2024</span>
              </div>
              <div className="flex justify-between">
                <span>Time:</span>
                <span>6:00 PM onwards</span>
              </div>
              <div className="flex justify-between">
                <span>Venue:</span>
                <span>Sri Krishna Temple</span>
              </div>
              <div className="flex justify-between">
                <span>Your Role:</span>
                <span>Scanning Desk Manager</span>
              </div>
              <div className="flex justify-between">
                <span>Shift:</span>
                <span>6:00 PM - 10:00 PM</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 
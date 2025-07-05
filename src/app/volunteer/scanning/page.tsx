'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import QRScanner from '../../../components/QRScanner';
import { Participant } from '../../../types/volunteer';
import { participantApi, scanApi } from '../../../lib/api';

export default function ScanningPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [recentScans, setRecentScans] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch participants from API
  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        setLoading(true);
        const response = await participantApi.getAll();
        
        if (response.success && response.data) {
          setParticipants(response.data);
          setRecentScans(response.data.filter(p => p.status === 'scanned').slice(0, 4));
        } else {
          setError(response.error || 'Failed to fetch participants');
        }
      } catch (err) {
        setError('Failed to fetch participants');
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, []);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    router.push('/auth/signin?role=volunteer');
    return null;
  }

  const handleStartScanning = () => {
    setIsScanning(true);
  };

  const handleStopScanning = () => {
    setIsScanning(false);
    setScannedCode(null);
  };

  const handleScan = async (data: string) => {
    if (data) {
      setScannedCode(data);
      
      try {
        // Process scan through API
        const response = await scanApi.processScan(data, session.user?.email || undefined);
        
        if (response.success && response.data) {
          const { participant } = response.data;
          
          // Update local state
          setParticipants(prev => 
            prev.map(p => 
              p.id === participant.id ? { ...p, status: 'scanned' as const } : p
            )
          );
          
          // Add to recent scans
          setRecentScans(prev => {
            const updated = [{ ...participant, status: 'scanned' as const }, ...prev.slice(0, 3)];
            return updated;
          });
          
          // Show success message
          console.log(`Successfully scanned: ${participant.name}`);
        } else {
          console.error('Scan failed:', response.error);
        }
      } catch (err) {
        console.error('Scan error:', err);
      } finally {
        setScannedCode(null);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scanned': return 'bg-green-500/20 text-green-300';
      case 'checked-in': return 'bg-yellow-500/20 text-yellow-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="bg-red-500/20 text-red-300 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-sm p-4"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-2xl">🕉️</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Scanning Desk</h1>
              <p className="text-blue-200">Welcome, {session.user?.name}</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => router.push('/volunteer/dashboard')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-5 gap-6 h-[calc(100vh-200px)]">
          {/* Scanner Section - 60% */}
          <div className="col-span-3 bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">QR Code Scanner</h2>
                {!isScanning ? (
                  <button
                    onClick={handleStartScanning}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
                  >
                    Start Scanning
                  </button>
                ) : (
                  <button
                    onClick={handleStopScanning}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
                  >
                    Stop Scanning
                  </button>
                )}
              </div>

              <div className="flex-1 flex items-center justify-center">
                <QRScanner onScan={handleScan} isScanning={isScanning} />
                {scannedCode && (
                  <div className="bg-green-500/20 text-green-300 p-4 rounded-lg mt-4">
                    Processing scan: {scannedCode}
                  </div>
                )}
              </div>

              {/* Recent Scans */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-3">Recent Scans</h3>
                <div className="grid grid-cols-2 gap-3">
                  {recentScans.map((participant) => (
                    <div
                      key={participant.id}
                      className="bg-white/5 rounded-lg p-3"
                    >
                      <div className="text-white font-medium">{participant.name}</div>
                      <div className="text-blue-200 text-sm">{participant.phone}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Participants List - 40% */}
          <div className="col-span-2 bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Participants</h2>
            <div className="h-full overflow-y-auto space-y-3">
              {participants.map((participant) => (
                <motion.div
                  key={participant.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-semibold">{participant.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(participant.status)}`}>
                      {participant.status.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="text-blue-200 text-sm space-y-1">
                    <div>{participant.email}</div>
                    <div>{participant.phone}</div>
                    <div className="text-xs text-blue-300">
                      Registered: {participant.registrationTime}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
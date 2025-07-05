'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';

export default function QRGeneratorPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [qrData, setQrData] = useState('1');
  const [participantName, setParticipantName] = useState('Test Participant');

  if (status === 'loading') {
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

  const generateTestQR = (participantId: string) => {
    setQrData(participantId);
    setParticipantName(`Test Participant ${participantId}`);
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
              <h1 className="text-2xl font-bold text-white">QR Code Generator</h1>
              <p className="text-blue-200">Generate test QR codes for scanning</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => router.push('/volunteer/scanning')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Go to Scanner
            </button>
            <button
              onClick={() => router.push('/volunteer/dashboard')}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto p-4">
        <div className="grid md:grid-cols-2 gap-8">
          {/* QR Code Display */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Generated QR Code</h2>
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-white p-4 rounded-lg">
                <QRCodeSVG
                  value={qrData}
                  size={200}
                  level="M"
                  includeMargin={true}
                />
              </div>
              <div className="text-center">
                <div className="text-white font-semibold text-lg">{participantName}</div>
                <div className="text-blue-200">ID: {qrData}</div>
              </div>
            </div>
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Quick Test QR Codes</h2>
            <div className="space-y-4">
              <p className="text-blue-200 mb-4">
                Click on any button below to generate a test QR code. You can then scan it using the scanner.
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((id) => (
                  <button
                    key={id}
                    onClick={() => generateTestQR(id.toString())}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg transition-colors font-semibold"
                  >
                    Participant {id}
                  </button>
                ))}
              </div>

              <div className="mt-6 p-4 bg-yellow-500/20 rounded-lg">
                <h3 className="text-yellow-300 font-semibold mb-2">Instructions:</h3>
                <ol className="text-blue-200 text-sm space-y-1">
                  <li>1. Click on any participant button above</li>
                  <li>2. A QR code will be generated</li>
                  <li>3. Go to the scanner page</li>
                  <li>4. Start scanning and point at this QR code</li>
                  <li>5. The participant should be marked as scanned</li>
                </ol>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6"
        >
          <h2 className="text-2xl font-bold text-white mb-4">How to Test the Scanner</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">📱</div>
              <h3 className="text-white font-semibold mb-2">1. Generate QR Code</h3>
              <p className="text-blue-200 text-sm">Click on any participant button to generate a test QR code</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">📷</div>
              <h3 className="text-white font-semibold mb-2">2. Open Scanner</h3>
              <p className="text-blue-200 text-sm">Navigate to the scanning page and start the scanner</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">✅</div>
              <h3 className="text-white font-semibold mb-2">3. Scan & Verify</h3>
              <p className="text-blue-200 text-sm">Point the scanner at the QR code and verify the result</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 
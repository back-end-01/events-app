'use client';

import { useEffect, useRef, useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';

// Type declarations for html5-qrcode
declare global {
  interface Window {
    Html5QrcodeScanner: any;
  }
}

interface QRScannerProps {
  onScan: (data: string) => void;
  isScanning: boolean;
}

export default function QRScanner({ onScan, isScanning }: QRScannerProps) {
  const [scanningAnimation, setScanningAnimation] = useState(false);

  useEffect(() => {
    if (isScanning) {
      setScanningAnimation(true);
    } else {
      setScanningAnimation(false);
    }
  }, [isScanning]);

  if (!isScanning) {
    return (
      <div className="text-center">
        <div className="w-80 h-80 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
          <div className="text-center">
            <div className="text-6xl mb-4">📷</div>
            <div className="text-white text-lg">Scanner Ready</div>
            <div className="text-blue-200 text-sm">Click "Start Scanning" to begin</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="w-80 h-80 bg-white/5 rounded-2xl border-2 border-dashed border-yellow-400 flex items-center justify-center mb-4 overflow-hidden relative">
        <div className="w-full h-full rounded-2xl overflow-hidden">
          <Scanner
            onResult={(result: any) => onScan(result)}
            onError={(error: any) => console.log('Scan error:', error)}
          />
        </div>
        
        {/* Scanning overlay */}
        {scanningAnimation && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-64 border-2 border-yellow-400 rounded-lg animate-pulse"></div>
          </div>
        )}
      </div>
      <div className="text-white text-lg">Scanner Active</div>
      <div className="text-blue-200 text-sm">Point camera at QR code</div>
    </div>
  );
} 
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import Modal from '../../components/Modal';
import styles from './success.module.css';

export default function SuccessPage() {
  const { data: session } = useSession();
  const [attendanceData, setAttendanceData] = useState('');
  const [giftData, setGiftData] = useState('');
  const [showGiftQR, setShowGiftQR] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [waitingForScan, setWaitingForScan] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [waitingForGiftScan, setWaitingForGiftScan] = useState(false);

  // Generate QR data
  const generateAttendanceData = () => {
    const data = JSON.stringify({
      type: 'attendance',
      userId: session?.user?.email,
      timestamp: Date.now(),
      event: 'Janmashtami 2025'
    });
    setAttendanceData(data);
  };

  const generateGiftData = () => {
    const data = JSON.stringify({
      type: 'gift',
      userId: session?.user?.email,
      timestamp: Date.now(),
      giftCode: `GIFT-${Math.random().toString(36).substr(2, 8).toUpperCase()}`
    });
    setGiftData(data);
  };

  // Auto-refresh QR data every 10 seconds
  useEffect(() => {
    if (showModal) {
      generateAttendanceData();
      const interval = setInterval(generateAttendanceData, 10000);
      return () => clearInterval(interval);
    }
  }, [showModal, session?.user?.email]);

  useEffect(() => {
    if (showGiftQR) {
      generateGiftData();
      const interval = setInterval(generateGiftData, 10000);
      return () => clearInterval(interval);
    }
  }, [showGiftQR, session?.user?.email]);

  const handleGiftClick = () => {
    setShowGiftQR(!showGiftQR);
  };

  // Use email as QR code value, or fallback to 'Registered'
  const qrValue = session?.user?.email || "Registered";

  const handleShowModal = () => {
    setShowModal(true);
    setWaitingForScan(true);
    // Simulate scan detection (auto-close after 5 seconds)
    setTimeout(() => {
      setShowModal(false);
      setWaitingForScan(false);
    }, 5000);
  };

  const handleShowGiftModal = () => {
    setShowGiftModal(true);
    setWaitingForGiftScan(true);
    setTimeout(() => {
      setShowGiftModal(false);
      setWaitingForGiftScan(false);
    }, 5000);
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.successPage}>
      <div className={styles.container}>
        {/* Success Header */}
        <div className={styles.header}>
          <div className={styles.successIcon}><span>✅</span></div>
          <h1 className={styles.title}>Registration Successful!</h1>
          <p className={styles.subtitle}>Welcome to Janmashtami 2025</p>
          <p className={styles.info}>Your ticket has been generated successfully</p>
        </div>

        {/* Ticket Information */}
        <div className={styles.ticketInfo}>
          <h2 className={styles.sectionTitle}>Your Ticket</h2>
          <div className={styles.ticketGrid}>
            <div className={styles.participantDetails}>
              <h3 className={styles.sectionSubtitle}>Participant Details</h3>
              <div className={styles.detailsList}>
                <div><strong>Name:</strong> {session.user?.name}</div>
                <div><strong>Email:</strong> {session.user?.email}</div>
                <div><strong>Ticket ID:</strong> TKT-{Math.random().toString(36).substr(2, 8).toUpperCase()}</div>
                <div><strong>Event:</strong> Janmashtami 2025</div>
                <div><strong>Date:</strong> {new Date().toLocaleDateString()}</div>
              </div>
            </div>
            <div className={styles.eventInfo}>
              <h3 className={styles.sectionSubtitle}>Event Information</h3>
              <div className={styles.detailsList}>
                <div><strong>Venue:</strong> Temple Grounds</div>
                <div><strong>Time:</strong> 6:00 PM onwards</div>
                <div><strong>Dress Code:</strong> Traditional Indian</div>
                <div><strong>Entry:</strong> Free</div>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code Features */}
        <div className={styles.qrGrid}>
          {/* Attendance QR */}
          <div className={styles.qrBlock}>
            <div className={styles.qrIcon}><span>📱</span></div>
            <h3 className={styles.sectionSubtitle}>Mark Attendance</h3>
            <p className={styles.qrDesc}>Show this QR code to the volunteer to mark your attendance</p>
            <button
              onClick={handleShowModal}
              className={styles.attendanceButton}
            >
              Show QR Code
            </button>
          </div>
          {/* Gift QR */}
          <div className={styles.qrBlock}>
            <div className={styles.qrIconGift}><span>🎁</span></div>
            <h3 className={styles.sectionSubtitle}>Receive Gift</h3>
            <p className={styles.qrDescGift}>Show this QR code to collect your special gift</p>
            <button
              onClick={handleShowGiftModal}
              className={styles.giftButton}
            >
              Show Gift QR Code
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className={styles.instructions}>
          <h3 className={styles.sectionSubtitleCenter}>How to Use Your Ticket</h3>
          <div className={styles.instructionsGrid}>
            <div className={styles.instructionStep}>
              <div className={styles.instructionIcon}><span>1</span></div>
              <h4 className={styles.instructionTitle}>Arrive at Event</h4>
              <p className={styles.instructionDesc}>Come to the venue with your ticket ready</p>
            </div>
            <div className={styles.instructionStep}>
              <div className={styles.instructionIcon}><span>2</span></div>
              <h4 className={styles.instructionTitle}>Mark Attendance</h4>
              <p className={styles.instructionDesc}>Show attendance QR to volunteer</p>
            </div>
            <div className={styles.instructionStep}>
              <div className={styles.instructionIcon}><span>3</span></div>
              <h4 className={styles.instructionTitle}>Collect Gift</h4>
              <p className={styles.instructionDesc}>Show gift QR to receive your gift</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className={styles.navigation}>
          <button
            onClick={() => window.print()}
            className={styles.printButton}
          >
            📄 Print Ticket
          </button>
          <button
            onClick={() => window.location.href = '/events'}
            className={styles.eventsButton}
          >
            📅 View Events
          </button>
        </div>

        {/* Attendance QR Modal */}
        <Modal open={showModal} onClose={() => setShowModal(false)} title="Your Attendance QR Code">
          <div className={styles.modalContent}>
            <div className={styles.festiveIcon}>🕉️</div>
            <h2 className={styles.modalTitle}>Your Attendance QR Code</h2>
            <QRCodeSVG value={attendanceData} size={192} bgColor="#fff" fgColor="#000" />
            <button
              onClick={generateAttendanceData}
              className={styles.refreshButton}
            >
              <span>🔄</span> Refresh QR Code
            </button>
            <p className={styles.attendanceInfo}>Show this QR code at the event entrance.</p>
            <p className={styles.deactivateMsg}>QR code deactivates in 10 seconds.</p>
            {waitingForScan && (
              <div className={styles.waitingMsg}>Waiting for scan...</div>
            )}
          </div>
        </Modal>
        {/* Gift QR Modal */}
        <Modal open={showGiftModal} onClose={() => setShowGiftModal(false)} title="Your Gift QR Code" accent="purple">
          <div className={styles.modalContent}>
            <div className={styles.festiveIcon}>🕉️</div>
            <h2 className={styles.modalTitle}>Your Gift QR Code</h2>
            <QRCodeSVG value={giftData} size={192} bgColor="#fff" fgColor="#000" />
            <button
              onClick={generateGiftData}
              className={styles.giftButton}
            >
              <span>🔄</span>  Refresh QR Code
            </button>
            <p className={styles.attendanceInfo}>Show this QR code to collect your gift.</p>
            <p className={styles.deactivateMsg}>QR code deactivates in 10 seconds.</p>
            {waitingForGiftScan && (
              <div className={styles.waitingMsg}>Waiting for scan...</div>
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
} 
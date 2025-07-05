'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Modal from '../../components/Modal';
import styles from '../../components/Modal.module.css';

export default function EventsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState<'phone' | 'confirm'>('phone');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState('');

  const handleSignUp = () => {
    router.push('/signup');
  };

  const handleRegister = async () => {
    setIsSubmitting(true);
    const res = await fetch("/api/participants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    setIsSubmitting(false);
    if (res.ok) {
      setSubmitMsg('Thank you for registering!');
      setTimeout(() => {
        setShowModal(false);
        setModalStep('phone');
        setPhone('');
        setPhoneError('');
        setIsSubmitting(false);
        setSubmitMsg('');
        router.push('/success');
      }, 1500);
    } else {
      alert("Registration failed. Please try again.");
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
    setModalStep("phone");
    setPhone("");
    setSubmitMsg("");
  };

  function validatePhone(phone: string) {
    return /^[0-9]{10}$/.test(phone);
  }

  function handleNext() {
    if (!validatePhone(phone)) {
      setPhoneError('Please enter a valid 10-digit phone number.');
      return;
    }
    setPhoneError('');
    setModalStep('confirm');
  }

  function handleCancel() {
    setShowModal(false);
    setModalStep('phone');
    setPhone('');
    setPhoneError('');
    setIsSubmitting(false);
    setSubmitMsg('');
  }

  function handleBack() {
    setModalStep('phone');
    setPhoneError('');
  }

  const features = [
    {
      icon: '🕉️',
      title: 'Bhajan & Kirtan',
      description: 'Devotional songs and chanting'
    },
    {
      icon: '🎭',
      title: 'Drama & Dance',
      description: 'Krishna Leela performances'
    },
    {
      icon: '🍽️',
      title: 'Prasad Distribution',
      description: 'Blessed food offerings'
    },
    {
      icon: '🎨',
      title: 'Art & Craft',
      description: 'Krishna-themed activities'
    },
    {
      icon: '📚',
      title: 'Spiritual Discourse',
      description: 'Teachings from Bhagavad Gita'
    },
    {
      icon: '🎪',
      title: 'Cultural Programs',
      description: 'Traditional performances'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <h1 className="text-3xl font-bold text-white mb-8">Event Information</h1>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center pt-8 pb-6 px-4"
      >
        <div className="w-20 h-20 mx-auto mb-4 bg-yellow-400 rounded-full flex items-center justify-center">
          <span className="text-3xl">🕉️</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Janmashtami Celebration</h1>
        <p className="text-blue-200">Join us in celebrating Lord Krishna's divine birth</p>
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 pb-8">
        {/* Event Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Event Details</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📅</span>
                <div>
                  <div className="text-white font-semibold">Date & Time</div>
                  <div className="text-blue-200">August 26, 2024 • 6:00 PM onwards</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📍</span>
                <div>
                  <div className="text-white font-semibold">Venue</div>
                  <div className="text-blue-200">Sri Krishna Temple Complex<br />
                  Main Hall, Ground Floor<br />
                  123 Temple Road, City Center</div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🎫</span>
                <div>
                  <div className="text-white font-semibold">Entry</div>
                  <div className="text-blue-200">Free for all devotees</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">👥</span>
                <div>
                  <div className="text-white font-semibold">Capacity</div>
                  <div className="text-blue-200">500+ participants</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Event Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/20 transition-all duration-300"
              >
                <div className="text-3xl mb-2">{feature.icon}</div>
                <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
                <p className="text-blue-200 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Program Schedule</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="text-blue-300 font-mono text-sm w-20">6:00 PM</div>
              <div className="flex-1">
                <div className="text-white font-semibold">Opening Ceremony</div>
                <div className="text-blue-200 text-sm">Lamp lighting and prayers</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-blue-300 font-mono text-sm w-20">6:30 PM</div>
              <div className="flex-1">
                <div className="text-white font-semibold">Bhajan & Kirtan</div>
                <div className="text-blue-200 text-sm">Devotional songs</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-blue-300 font-mono text-sm w-20">7:30 PM</div>
              <div className="flex-1">
                <div className="text-white font-semibold">Krishna Leela Drama</div>
                <div className="text-blue-200 text-sm">Theatrical performance</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-blue-300 font-mono text-sm w-20">8:30 PM</div>
              <div className="flex-1">
                <div className="text-white font-semibold">Midnight Celebration</div>
                <div className="text-blue-200 text-sm">Birth of Lord Krishna</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-blue-300 font-mono text-sm w-20">9:00 PM</div>
              <div className="flex-1">
                <div className="text-white font-semibold">Prasad Distribution</div>
                <div className="text-blue-200 text-sm">Blessed food for all</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sign Up Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <button
            onClick={handleOpenModal}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Register as Participant
          </button>
        </motion.div>
      </div>
      {showModal && (
        <Modal open={showModal} onClose={handleCancel} title={modalStep === 'phone' ? 'Enter Your Phone Number' : 'Confirm Registration'}>
          {modalStep === 'phone' && (
            <div className={styles.modalContent}>
              <h3 className={styles.modalSectionTitle}>Enter Your Phone Number</h3>
              <input
                type="tel"
                maxLength={10}
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="10-digit phone number"
                className={styles.modalInput}
              />
              {phoneError && <div className={styles.modalError}>{phoneError}</div>}
              <div className={styles.modalButtonGroup}>
                <button
                  onClick={handleNext}
                  className={styles.modalButton}
                  disabled={!phone || !!phoneError}
                >
                  Next
                </button>
                <button
                  onClick={handleCancel}
                  className={styles.modalButtonAlt}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          {modalStep === 'confirm' && (
            <div className={styles.modalContent}>
              <h3 className={styles.modalSectionTitle}>Confirm Registration</h3>
              <p className={styles.attendanceInfo}>Phone: <span style={{ color: 'black', fontWeight: 500 }}>{phone}</span></p>
              <div className={styles.modalButtonGroup}>
                <button
                  onClick={handleRegister}
                  className={styles.modalButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Registering...' : 'Yes, Register Me'}
                </button>
                <button
                  onClick={handleBack}
                  className={styles.modalButtonAlt}
                  disabled={isSubmitting}
                >
                  Back
                </button>
              </div>
              {submitMsg && <p className={styles.attendanceInfo} style={{ marginTop: 16 }}>{submitMsg}</p>}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
} 
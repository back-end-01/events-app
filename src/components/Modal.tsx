'use client';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Modal.module.css';

export default function Modal({
  open,
  onClose,
  children,
  title,
  accent = 'yellow'
}: {
  open: boolean,
  onClose: () => void,
  children: React.ReactNode,
  title?: string,
  accent?: 'yellow' | 'blue' | 'purple'
}) {
  // Accent color classes
  const accentClass = {
    yellow: styles.ringYellow,
    blue: styles.ringBlue,
    purple: styles.ringPurple
  }[accent];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.modalOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={`${styles.modalContent} ${accentClass}`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <button
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Close"
            >×</button>
            {title && <h2 className={`${styles.modalTitle} ${styles[accent + 'Text']}`}>{title}</h2>}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 
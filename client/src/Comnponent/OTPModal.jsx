import React, { useState } from 'react';
import axios from 'axios';
import styles from './Chatbot.module.css';

const OTPModal = ({ onVerified, onClose, otpData }) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleVerify = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/otp/verify', { otp });
      if (res.data.success) {
        onVerified();
      }
    } catch (err) {
      setError('Invalid OTP. Please try again.');
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>OTP Verification</h2>
        <p>Please enter the OTP sent to you (for demo, OTP: {otpData})</p>
        <input
          className={styles.input}
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button className={styles.button} onClick={handleVerify}>Verify</button>
        <button 
          className={styles.button}
          onClick={onClose} 
          style={{ marginTop: '5px', backgroundColor: '#6c757d' }}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default OTPModal;

import React, { useState } from 'react';
import axios from 'axios';
import OTPModal from './OTPModal';
import styles from './Chatbot.module.css'; // Import CSS module

const Chatbot = () => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [otpData, setOtpData] = useState(null);

  // Request OTP before sending the question
  const requestOTP = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/otp/generate');
      if (res.data.success) {
        setOtpData(res.data.otp);
        setShowOTP(true);
      }
    } catch (err) {
      console.error('Error generating OTP:', err);
    }
  };

  const handleSubmit = async () => {
    if (!question.trim()) return;
    await requestOTP();
  };

  // After OTP verification, send the question to the chatbot endpoint
  const onOTPVerified = async () => {
    setShowOTP(false);
    try {
      const res = await axios.post('http://localhost:5000/api/chatbot/ask', { question });
      if (res.data.response) {
        setResponse(res.data.response);
      }
    } catch (err) {
      console.error('Error getting chatbot response:', err);
      setResponse("Sorry, I'm having trouble processing your request.");
    }
  };

  return (
    <div className={styles.chatbotContainer}>
      <h1>Programming Chatbot</h1>
      <textarea
        className={styles.textarea}
        rows="4"
        placeholder="Type your programming question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <br />
      <button className={styles.button} onClick={handleSubmit}>Ask Question</button>
      {response && (
        <div className={styles.response}>
          <h3>Chatbot Response:</h3>
          <p>{response}</p>
        </div>
      )}
      {showOTP && (
        <OTPModal
          otpData={otpData}
          onVerified={onOTPVerified}
          onClose={() => setShowOTP(false)}
          moduleStyles={styles}  // Pass down the styles if needed
        />
      )}
    </div>
  );
};

export default Chatbot;

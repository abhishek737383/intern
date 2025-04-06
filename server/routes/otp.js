import express from 'express';
const router = express.Router();

let currentOTP = null;

// Endpoint to generate an OTP
router.post('/generate', (req, res) => {
  // Generate a random 6-digit OTP
  currentOTP = Math.floor(100000 + Math.random() * 900000).toString();
  // In a real scenario, you would send the OTP via email/SMS.
  res.json({ success: true, otp: currentOTP });
});

// Endpoint to verify OTP
router.post('/verify', (req, res) => {
  const { otp } = req.body;
  if (otp && otp === currentOTP) {
    currentOTP = null; // Invalidate OTP after verification
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false, message: 'Invalid OTP' });
  }
});

export default router;

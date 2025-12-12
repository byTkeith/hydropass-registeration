require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT || 3000;

// CRITICAL: Allow large payloads (50MB) to support multiple high-res ID photos and PDFs
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Enable CORS for your frontend
app.use(cors());

app.post('/send-email', async (req, res) => {
  try {
    const { to, subject, html, attachments } = req.body;

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Missing EMAIL_USER or EMAIL_PASS environment variables');
      return res.status(500).json({ success: false, error: 'Server misconfiguration: Missing credentials' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: Array.isArray(to) ? to.join(',') : to,
      subject: subject || 'Guest Registration',
      html: html || '',
      attachments: attachments || [],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    
    res.status(200).json({ success: true, message: 'Email sent successfully' });

  } catch (error) {
    console.error('Failed to send email:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to send email' });
  }
});

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Guest Registration Backend is Online');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
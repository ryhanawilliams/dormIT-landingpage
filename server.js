const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors()); // Allow frontend to communicate with backend

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/waitlist', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a schema for the waitlist
const userSchema = new mongoose.Schema({
  email: String,
});

const User = mongoose.model('User', userSchema);

// Email configuration (using Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com', // Replace with your Gmail
    pass: 'your-email-password', // Replace with your Gmail password or app-specific password
  },
});

// API endpoint to handle waitlist submission
app.post('/api/waitlist', async (req, res) => {
  const { email } = req.body;

  try {
    // Save email to database
    const user = new User({ email });
    await user.save();

    // Send confirmation email
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'You’re on the waitlist!',
      text: `Hi there, thanks for joining the waitlist! We’ll notify you when we launch.`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Success' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add to waitlist or send email' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
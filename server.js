const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./module/User'); // Adjust path as needed
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 2423;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes

// Get Login Page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'login.html'));
});

// Get Signup Page
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'signup.html'));
});

// Post Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && user.password === password) {
      res.send(`<h1>Welcome, ${user.username}!</h1>`);
    } else {
      res.send('<h2>Invalid credentials. <a href="/">Try again</a></h2>');
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).send('Server error during login');
  }
});


// Post Signup
app.post('/signup', async (req, res) => {
  const { username, email, mobile, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.send('<h2>User with this email already exists. <a href="/">Login</a></h2>');
    }

    const newUser = new User({ username, email, mobile, password });
    await newUser.save();
    res.send('<h2>Signup successful! <a href="/">Login here</a></h2>');
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).send('Server error during signup');
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

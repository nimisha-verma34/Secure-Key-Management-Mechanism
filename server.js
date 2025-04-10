const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const CryptoJS = require('crypto-js');
const crypto = require('crypto');
const { publicKey, privateKey } = require('./generateKeys'); 
const bodyParser = require('body-parser');
const path = require('path');
const app = express();


// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Define a route to serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});


const PORT = process.env.PORT || 5000;
const mongoURI = 'mongodb://localhost:27017/secure_key_management';

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// User Model
const User = require('./models/User');

// Routes
// Register User
app.post('/api/users/register', async (req, res) => {
  const { name, dob, country, state, city, email, password } = req.body;

  try {
    // Check if email already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Generate AES key
    const aesKey = crypto.randomBytes(32).toString('hex'); // 256-bit key
    const encryptedAesKey = CryptoJS.AES.encrypt(aesKey, 'nimisha@123').toString();

    // Encrypt sensitive fields with AES
    const encryptedName = CryptoJS.AES.encrypt(name, aesKey).toString();
    const encryptedDob = CryptoJS.AES.encrypt(dob, aesKey).toString();
    const encryptedCountry = CryptoJS.AES.encrypt(country, aesKey).toString();
    const encryptedState = CryptoJS.AES.encrypt(state, aesKey).toString();
    const encryptedCity = CryptoJS.AES.encrypt(city, aesKey).toString();

    // Encrypt AES key with RSA
    const encryptedAesKeyWithRsa = crypto.publicEncrypt(publicKey, Buffer.from(aesKey, 'hex')).toString('base64');

    user = new User({
      name: encryptedName,
      dob: encryptedDob,
      country: encryptedCountry,
      state: encryptedState,
      city: encryptedCity,
      email,
      password,
      encryptedSecretKey: encryptedAesKeyWithRsa // Store the AES key encrypted with RSA
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user
    await user.save();

    res.status(200).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Login User
app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' }); // User not found
    }

    // Decrypt encrypted AES key with RSA
    const decryptedAesKey = crypto.privateDecrypt(privateKey, Buffer.from(user.encryptedSecretKey, 'base64')).toString('hex');

    // Decrypt sensitive fields with AES
    const decryptedName = CryptoJS.AES.decrypt(user.name, decryptedAesKey).toString(CryptoJS.enc.Utf8);
    const decryptedDob = CryptoJS.AES.decrypt(user.dob, decryptedAesKey).toString(CryptoJS.enc.Utf8);
    const decryptedCountry = CryptoJS.AES.decrypt(user.country, decryptedAesKey).toString(CryptoJS.enc.Utf8);
    const decryptedState = CryptoJS.AES.decrypt(user.state, decryptedAesKey).toString(CryptoJS.enc.Utf8);
    const decryptedCity = CryptoJS.AES.decrypt(user.city, decryptedAesKey).toString(CryptoJS.enc.Utf8);

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' }); // Password does not match
    }

    res.json({
      name: decryptedName,
      dob: decryptedDob,
      country: decryptedCountry,
      state: decryptedState,
      city: decryptedCity,
      email: user.email
    });
  } catch (err) {
    console.error('Error logging in user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


  

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


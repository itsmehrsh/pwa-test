// server.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const {
  generateRegistrationOptions,
  verifyRegistration,
  generateAuthenticationOptions,
  verifyAuthentication,
} = require('@simplewebauthn/server');

const app = express();
app.use(cors());
app.use(bodyParser.json());

let userDatabase = {}; // Use a proper database in a real application

app.post('/register', (req, res) => {
  const userId = req.body.userId; // Assume unique user ID is sent
  const options = generateRegistrationOptions({
    rpName: 'Your App Name',
    rpID: 'localhost', // Change this to your domain
    userID: userId,
    userName: 'user@example.com',
  });
  userDatabase[userId] = { options };
  res.json(options);
});

app.post('/verify-registration', async (req, res) => {
  const { userId, credential } = req.body;
  const expectedOptions = userDatabase[userId].options;
  const verification = await verifyRegistration(expectedOptions, credential);
  if (verification.verified) {
    // Save credential info in your database
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

app.post('/login', (req, res) => {
  const userId = req.body.userId; // Unique user ID sent
  const options = generateAuthenticationOptions();
  userDatabase[userId].options = options; // Store options for this user
  res.json(options);
});

app.post('/verify-authentication', async (req, res) => {
  const { userId, credential } = req.body;
  const verification = await verifyAuthentication(userDatabase[userId].options, credential);
  if (verification.verified) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

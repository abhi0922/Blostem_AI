const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const users = [
  {
    id: '1',
    email: 'demo@blostem.ai',
    password: 'demo123',
    name: 'Demo User',
    role: 'admin'
  }
];

router.post('/register', (req, res) => {
  const { email, password, name } = req.body;
  
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }
  
  const newUser = {
    id: String(users.length + 1),
    email,
    password,
    name,
    role: 'user'
  };
  
  users.push(newUser);
  
  const token = jwt.sign(
    { id: newUser.id, email: newUser.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  res.json({
    token,
    user: { id: newUser.id, email: newUser.email, name: newUser.name }
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  if (user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name }
  });
});

router.get('/me', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    res.json({ user: { id: user.id, email: user.email } });
  });
});

module.exports = router;
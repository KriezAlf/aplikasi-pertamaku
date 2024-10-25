import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import https from 'https';
import fs from 'fs';
import rateLimit from 'express-rate-limit';


const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'https://4.237.59.7',
  optionsSuccessStatus: 200,
}));


const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 200,
  message: 'Too many requests, please try again later.',
});
app.use(limiter);


const connection = new sqlite3.Database('./db/aplikasi.db');
const options = {
  key: fs.readFileSync('/etc/ssl/private/privkey.pem'),
  cert: fs.readFileSync('/etc/ssl/certs/fullchain.pem'),
};


const validateEmail = (email) => {
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return emailRegex.test(email);
};


app.get('/api/user/:id', (req, res) => {
  const query = `SELECT * FROM users WHERE id = ?`;
  connection.all(query, [req.params.id], (error, results) => {
    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(results);
  });
});


app.post('/api/user/:id/change-email', (req, res) => {
  const newEmail = req.body.email;

  if (!validateEmail(newEmail)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  const query = `UPDATE users SET email = ? WHERE id = ?`;
  connection.run(query, [newEmail, req.params.id], function (err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    if (this.changes === 0) {
      return res.status(404).send('User not found');
    }
    res.status(200).send('Email updated successfully');
  });
});


app.get('/api/file', (req, res) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const fileName = path.basename(req.query.name); 
  const filePath = path.join(__dirname, 'files', fileName);

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(err.status || 500).end();
    }
  });
});


app.listen(3000, () => {
  console.log('Server running on port 3000');
});


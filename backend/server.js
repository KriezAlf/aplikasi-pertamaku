import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';
import cors from 'cors';

const app = express();
app.use(express.json())
app.use(cors({
  origin: '*',
  optionsSuccessStatus: 200,
}));

app.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  next();
});


const connection = new sqlite3.Database('./db/aplikasi.db')

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
  const query = `UPDATE users SET email = ? WHERE id = ?`;

  connection.run(query, [newEmail, req.params.id], function(err) {
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

    const filePath = path.join(__dirname, 'files', req.query.name);
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(err.status).end();
        }
    });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

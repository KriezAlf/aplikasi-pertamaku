import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import https from 'https';
import fs from 'fs';
import rateLimit from 'express-rate-limit';

const app = express();
const PORT = "3000";

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors({
	origin: ['https://4.237.59.7', 'http://4.237.59.7'],
  optionsSuccessStatus: 200,
}));

const limit = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 100, 
  message: 'Too many requests, please try again later.',
});
app.use(limit);

const connection = new sqlite3.Database('./db/aplikasi.db')

const options = {
  key: fs.readFileSync('./certs/myserver.key'),
  cert: fs.readFileSync('./certs/myserver.crt'),
};

app.get('/api/user/:id', (req, res) => {
  const userId = req.params.id;
  const query = `SELECT * FROM users WHERE id = ?`;

  connection.all(query, [userId], (error, results) => {
    if (error) {
      res.status(500).send('Database error');
      return;
    }
    res.json(results);
  });
});

app.post('/api/user/:id/change-email', (req, res) => {
  const newEmail = req.body.email;
  const userId = req.params.id;

  const query = `UPDATE users SET email = ? WHERE id = ?`;

  connection.run(query, [newEmail, userId], function (err) {
    if (err) {
      res.status(500).send('Database error');
      return;
    }
    if (this.changes === 0) {
      res.status(404).send('User not found');
    } else {
      res.status(200).send('Email updated successfully');
    }
  });
});

app.get('/api/file', (req, res) => {
  const __filename = fileURLToPath(import.meta.url); 
  const __dirname = path.dirname(__filename); 

  const filePath = path.join(__dirname, 'files', req.query.name);
	if (fs.existsSync(filepath)){
		res.sendFile(filePath);
	} else {
		res.status(404).send('File not found');
	}
});

https.createServer(options, app).listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


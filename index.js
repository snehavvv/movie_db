const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');


const path = require('path');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'yourpassword',
  database: 'movies_db'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL database.');
});

// GET /movies
app.get('/movies', (req, res) => {
  db.query('SELECT * FROM movies', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST /movies
app.post('/movies', (req, res) => {
  const { title, director, genre, release_year, rating } = req.body;
  db.query(
    'INSERT INTO movies (title, director, genre, release_year, rating) VALUES (?, ?, ?, ?, ?)',
    [title, director, genre, release_year, rating],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, ...req.body });
    }
  );
});

// PUT /movies/:id
app.put('/movies/:id', (req, res) => {
  const { id } = req.params;
  const { title, director, genre, release_year, rating } = req.body;
  db.query(
    'UPDATE movies SET title=?, director=?, genre=?, release_year=?, rating=? WHERE id=?',
    [title, director, genre, release_year, rating, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id, ...req.body });
    }
  );
});

// DELETE /movies/:id
app.delete('/movies/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM movies WHERE id=?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Movie deleted', id });
  });
});

const PORT = process.env.PORT || 3000;
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

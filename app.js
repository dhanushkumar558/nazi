const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 3000;

// Create a connection pool to the MySQL database
const pool = mysql.createPool({
  host: 'localhost',
  user: 'dhanush',
  password: 'priya0818',
  database: 'ems',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Check if the connection to MySQL is successful
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
  } else {
    console.log('Connected to MySQL database!');
    connection.release(); // Release the connection
  }
});

// Use body-parser middleware to parse POST requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve your HTML file from the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle POST request when the form is submitted
app.post('/add', (req, res) => {
  const name = req.body.name;
  const username = req.body.username;

  // Insert the data into the MySQL database
  pool.query('INSERT INTO boxes (name, username) VALUES (?, ?)', [name, username], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

    res.redirect('/');
  });
});

// Handle DELETE request when the delete button is clicked
app.delete('/delete/:id', (req, res) => {
  const id = req.params.id;

  // Delete the data from the MySQL database
  pool.query('DELETE FROM boxes WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

    res.sendStatus(200);
  });
});

// Retrieve data from the MySQL database
app.get('/getData', (req, res) => {
  pool.query('SELECT * FROM boxes', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

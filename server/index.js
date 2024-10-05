const express = require('express');
const mysql = require('mysql2');
const app = express();

const pool = mysql.createPool({
  host: 'mysql',
  user: 'root',
  password: 'root',
  database: 'app_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.get('/', (req, res) => {
  const name = 'Aluno Full Cycle';
  
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      res.status(500).send('Error connecting to database');
      return;
    }

    connection.query(`INSERT INTO people (name) VALUES (?)`, [name], (err) => {
      if (err) {
        connection.release();
        throw err;
      }

      connection.query(`SELECT name FROM people`, (err, results) => {
        connection.release(); // Libera a conexão de volta para o pool
        if (err) throw err;

        const namesList = results.map(person => `<li>${person.name}</li>`).join('');
        res.send(`
          <h1>Full Cycle Rocks!</h1>
          <ul>${namesList}</ul>
        `);
      });
    });
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

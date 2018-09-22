const express = require ('express');
const cors = require ('cors');
const mysql = require ('mysql');

const app = express();
const port = 5000;

const connection = mysql.createConnection({
  host: 'itgbackendhiring.mysql.database.azure.com',
  user: 'backendhire@itgbackendhiring',
  password: 'CoughSyrup123!',
  database: 'itghiringdb'
})

app.use(cors({
  origin: 'http://localhost:3000'
}));

app.route('/movies')
  .get((req, res) => {
    connection.connect(() => {
      connection.query("SELECT * FROM movies", (error, result, fields) => {
        if (error) throw error;
        res.send(result);
      });
    });
  });

app.listen(port, () => console.log(`Listening to port ${port}`));
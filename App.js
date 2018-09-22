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

const queryAllMovies = "SELECT * FROM movies";
const queryMoviesByYears = "SELECT * FROM movies WHERE year BETWEEN ? AND ?";

app.use(cors({
  origin: 'http://localhost:3000'
}));

app.route('/movies')
  .get((req, res) => {

    let query = "";
    let reqParam = [];

    if (req.query.start && req.query.end) {
      query = queryMoviesByYears;
      reqParam = [req.query.start, req.query.end];
    }
    else {
      query = queryAllMovies;
    }

    connection.connect(() => {
      connection.query(query, reqParam, (error, result, fields) => {
        if (error) throw error;
        res.send(result);
      });
    });
  });

app.listen(port, () => console.log(`Listening to port ${port}`));
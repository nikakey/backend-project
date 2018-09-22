const express = require ('express');
const cors = require ('cors');
const mysql = require ('mysql');
const { body, validationResult } = require('express-validator/check');
const bodyParser = require ('body-parser');

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
const queryMoviesByTitle = "SELECT * FROM movies WHERE title LIKE ?";
const queryInsertNewMovie = "INSERT INTO movies (title, year, director, cast, notes, genre) VALUES (?,?,?,?,?,?)";
const queryGetMovieById = "SELECT * FROM movies WHERE id = ?";

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
    else if (req.query.search) {
      query = queryMoviesByTitle;
      reqParam = ['%' + req.query.search + '%'];
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
  })
  .post([
    body('title')
      .isLength({ min: 1 }).trim()
      .withMessage('Title should not be empty!')
      .trim()
      .escape(),
    body('year')
      .isLength({ min: 4, max: 4 })
      .withMessage('Year should contain 4 numbers!')
      .isNumeric()
      .withMessage('The year should be a number!'),
    body('director')
      .isLength({ min: 1 })
      .withMessage('Director name should not be empty!')
      .isAlpha()
      .withMessage('The director name should contain only letters!')
      .trim()
      .escape(),
    body('genre')
      .isAlpha()
      .withMessage('Genre should contain only letters!')
      .not()
      .isEmpty()
      .trim()
      .escape()
    ], 
    (req, res) => {
      const errors = validationResult(req);
      
      if (!errors.isEmpty()) {
        return res.json({errors: errors.array()});
      }
      else {
        let values = [req.body.title, req.body.year, req.body.director, "", "", req.body.genre];

        connection.connect(() => {
          connection.query(queryInsertNewMovie, values, (error, resInsert, fields) => {
            if (error) throw error;
            console.log(resInsert);
          });
        });
      }

    });

app.listen(port, () => console.log(`Listening to port ${port}`));
const express = require ('express');
const cors = require ('cors');
const dbConnection = require ('./dbConnection.js');

const { body, validationResult } = require('express-validator/check');
const bodyParser = require ('body-parser');

const app = express();
const port = 5000;

app.use(cors({
  origin: 'http://localhost:3000'
}));

app.use(bodyParser.json({ type: 'application/json' }));

app.route('/movies')
  .get((req, res) => {
    dbConnection.getMovies(req.query, (result)=>{res.send(result)});
    
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
        dbConnection.createMovie(req.body, (result) => {res.send(result)});
      }
    });

app.listen(port);
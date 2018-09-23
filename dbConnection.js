const mysql = require ('mysql');

var exports = module.exports = {};

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

const getSelectQuery = (reqParam) => {

  
  let result = {
    query: "",
    values: []
  }

  if (reqParam.start && reqParam.end) {
    result.query = queryMoviesByYears;
    result.values = [reqParam.start, reqParam.end];
  }
  else if (reqParam.search) {
    result.query = queryMoviesByTitle;
    result.values = ['%' + reqParam.search + '%'];
  }
  else {
    result.query = queryAllMovies;
  }

  return result;
}

exports.getMovies = (getRequest, callback) => {
  
  const res = getSelectQuery(getRequest.query);

  connection.connect(() => {
    connection.query(res.query, res.values, (error, result, fields) => {
      if (error) throw error;
      callback(result);
    });
  });
}

exports.createMovie = (movie, callback) => {

  const values = [movie.title, movie.year, movie.director, "", "", movie.genre];

  connection.connect(() => {
    connection.query(queryInsertNewMovie, values, (error, resInsert, fields) => {
      if (error) throw error;
      connection.query(queryGetMovieById, [resInsert.insertId], (error, resSelect, fields) => {
        if (error) throw error;
        callback(resSelect);
      });
    });
  });
}


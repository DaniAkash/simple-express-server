const express = require("express");
const fs = require("fs");

/**
 * uses the inbuilt path module to 
 * do operations based on the OS
 */
const path = require("path");

/**
 * Loads list of engines from consolidate
 */
const engines = require('consolidate');

/**
 * Creates the Express server
 */
const app = express();

/**
 * Users array that will be loaded with
 * data from users.json file
 */
const users = [];

/**
 * Loading the users data
 */
fs.readFile(path.join(__dirname, '../users.json'), {encoding: 'utf8'}, (err, data) => {
  if (err) {
    console.error(err);
  }

  JSON.parse(data).forEach(user => {
    user.name.full = user.name.first + ' ' + user.name.last;
    users.push(user);
  });
});

/**
 * Defined handlebars as a valid engine
 * using the engine names we got from consolidate
 */
app.engine('hbs', engines.handlebars);

/**
 * Setting the views directory
 * and the view engine to pug
 * 
 * __dirname gets the current directory of the file,
 * it should be later joined with the directory in which the views are present
 */
app.set('views', path.join( __dirname, './views'));
app.set('view engine', 'hbs'); // pug has in built support and doesn't need consolidate

/**
 * Setting up a directory to serve static files
 * using express static middleware
 */
app.use('/images', express.static(path.join(__dirname, '../public/images')));
app.use('/css', express.static(path.join(__dirname, '../public/css')));

app.get('/', (req, res) => {

  /**
   * Will render a plain text
   */
  // res.send("Hello, World!");

  /**
   * Will render complicated html with the help of templates
   * we created in the view directory
   */
  res.render("index", { users });
});

app.get('/welcome', (req, res) => {
  res.send("<h1>Welcome to express!</h1>");
});

app.get(/crazy.*/, (req, res, next) => {
  console.log("Crazy path excecuted!");
  next();
})

app.get('/users', (req, res) => {
  let links = '';

  users.forEach(function (user) {
    links += '<a href="/' + user.username + '">' + user.name.full + '</a><br>'
  })
  res.send(links);
})

app.get('/:user', (req, res) => {
  const username = req.params.user;
  res.send(username);
})

const server = app.listen(8000, () => {
  console.log("Server running in port: ", server.address().port)
});
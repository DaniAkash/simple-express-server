const express = require("express");
const fs = require("fs");

const app = express();

app.get('/', (req, res) => {
  res.send("Hello, World!");
});

app.get('/welcome', (req, res) => {
  res.send("<h1>Welcome to express!</h1>");
});

const users = [];

app.get('/users', (req, res) => {
  let links = '';

  users.forEach(function (user) {
    links += '<a href="/' + user.username + '">' + user.name.full + '</a><br>'
  })
  res.send(links);
})

fs.readFile('/sandbox/users.json', {encoding: 'utf8'}, (err, data) => {
  if (err) {
    console.error(err);
  }

  JSON.parse(data).forEach(user => {
    user.name.full = user.name.first + ' ' + user.name.last;
    users.push(user);
  });
});

const server = app.listen(8000, () => {
  console.log("Server running in port: ", server.address().port)
});
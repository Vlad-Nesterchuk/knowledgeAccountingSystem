let express = require("express");

var server = express();

server.get('/', function(req, res) {
  res.sendfile('./app/index.html');
});

server.get('/knowledgeareas', function(req, res) {
  res.sendfile('./serverdata/knowledgeareas.json');
});

server.get('/developers', function(req, res) {
  res.sendfile('./serverdata/developers.json');
});

server.use(express.static('app'));
server.listen(8080);
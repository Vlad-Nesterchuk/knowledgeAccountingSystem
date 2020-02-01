let express = require("express");

let server = express();

const jsonParser = express.json();


server.disable('view cache');

server.get('/', function(req, res) {
  res.sendfile('./app/index.html');
});

server.get('/knowledgeareas', function(req, res) {
  res.sendfile('./serverdata/knowledgeareas.json');
});

server.get('/developers', function(req, res) {
  res.sendfile('./serverdata/developers.json');
});

server.post("/developers", jsonParser, function (request, response) {
  const fs = require('fs')
  try {
    const data = fs.writeFileSync('serverdata/developers.json', JSON.stringify(request.body));
    response.end('OK')
  } catch (err) {
  console.error(err)
}
});

server.use(express.static('app'));
server.listen(8080);
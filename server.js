// npm install ws
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3000 });
console.log(`WebSocket сервер запущен на порту ${wss.options.port}`);

wss.on('connection', (connection) => {
    console.log('Новый пользователь подключился');
    connection.on('message', (message) => {
        console.log('Получено сообщение: ', message); //JSON.parse(JSON.stringify(message)).data
        // Рассылаем сообщение всем клиентам
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message.toString());
            }
        });
    });
});

// http server
const http = require('http');
const url = require('url');
const fs = require('fs');
const port = 80;

const httpserver = http.createServer(function (req, res) {
  const q = url.parse(req.url, true);
  let filename;
  if (q.pathname === "/") {
    filename = "./client/client.html"
  } else {
    filename = "." + q.pathname
  }
  fs.readFile(filename, function(err, data) {
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'});
      return res.end("404 Not Found");
    } 
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
})
httpserver.listen(port, function(){
  console.log(`HTTP сервер запущен на порту ${port}`)
});
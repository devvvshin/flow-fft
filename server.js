const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);


app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

app.get('/fft', (req, res) => {
  res.sendFile(__dirname + '/fft.html');
})


http.listen(4000, '0.0.0.0', () => {
  console.log('server')
});

const path = require('path');
const express = require('express');
const app = express();

var public_path = path.join(__dirname, 'public');

app.use('/static', express.static(public_path))

app.get('/', function (req, res) {
  res.sendFile(path.join(public_path, 'index.html'));
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

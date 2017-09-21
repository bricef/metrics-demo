const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')

const catalogue = require("./catalogue.json")

const app = express()

var public_path = path.join(__dirname, 'public');

// Parse incoming json
app.use(bodyParser.json())
app.set('json spaces', 2);

// Serve static files from public dir
app.use('/public', express.static(public_path))

app.post("/api/purchase", function(req, res){
  var total = req.body.cart.reduce((a,line)=>{
    return a + (line.quantity * catalogue[line.product.id])
  }, 0)

})

app.get("/api/catalogue", function(req, res){
  res.json(catalogue)
}) 

// default is to render home page
app.get('/', function (req, res) {
  res.sendFile(path.join(public_path, 'index.html'));
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

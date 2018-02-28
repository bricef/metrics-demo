const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')
const _ = require('lodash')
const epimetheus = require('epimetheus')
const prometheus = require('prom-client')

const catalogue = require("./catalogue.json")

const app = express()

var public_path = path.join(__dirname, 'public');

// Parse incoming json
app.use(bodyParser.json())
app.set('json spaces', 2);

// Instrument server with metrics endpoint
epimetheus.instrument(app)

// Add error logging middleware
function logErrors (err, req, res, next) {
  console.error(err.stack)
  next(err)
}
app.use(logErrors)

// Create custom counter for sales
const sales_counter = new prometheus.Counter({name:'sales', help:'Total sales in GBP'})

// Serve static files from public dir
app.use('/mighty-fine/public', express.static(public_path))

app.post("/mighty-fine/api/purchase", function(req, res){
  var order = _.reduce(req.body, (order,item,line)=>{
    order.count += item.count;
    order.total += (item.count * catalogue[item.id].price);
    console.log("Order made: ", order);
    return order;
  }, {
    status: "OK",
    count: 0,
    total: 0,
  })
  sales_counter.inc(order.total);
  res.json(order)
})

app.get("/mighty-fine/api/catalogue", function(req, res){
  res.json(catalogue)
}) 

// default is to render home page
app.get('/', function (req, res) {
  res.sendFile(path.join(public_path, 'index.html'));
})

app.get('/mighty-fine', function (req, res) {
  res.sendFile(path.join(public_path, 'index.html'));
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

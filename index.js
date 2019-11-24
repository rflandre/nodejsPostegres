const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))


var pg = require ('pg');
var EventEmitter = require('events');
var util = require('util');

// Build and instantiate our custom event emitter
function DbEventEmitter(){
  EventEmitter.call(this);
}

util.inherits(DbEventEmitter, EventEmitter);
var dbEventEmitter = new DbEventEmitter;

// Define the event handlers for each channel name
dbEventEmitter.on('new_order', (msg) => {
  // Custom logic for reacting to the event e.g. firing a webhook, writing a log entry etc
  console.log('New order received: ' + msg.orderId);
});

// Connect to Postgres (replace with your own connection string)
pg.connect('postgres://postgres:password@localhost:5432/postgres', function(err, client) {
  if(err) {
    console.log(err);
  }

  // Listen for all pg_notify channel messages
  client.on('notification', function(msg) {
    let payload = JSON.parse(msg.payload);
    dbEventEmitter.emit(msg.channel, payload);
  });
  
  // Designate which channels we are listening on. Add additional channels with multiple lines.
  client.query('LISTEN new_order');
});
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000


const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://ilolhcujlhedox:2be8ff85d49d5b1022b4ff7b3c55a81f8c636d9b604ca8fc3df89bafcfa652ff@ec2-54-217-206-65.eu-west-1.compute.amazonaws.com:5432/d52bf94gqsc648',
  ssl: true
});

var EventEmitter = require('events');
var util = require('util');

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/db', async (req, res) => {
    try {
      
      
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
      
console.log('New order received: ');
      const client = await pool.connect()


  // Listen for all pg_notify channel messages
  client.on('notification', function(msg) {
    let payload = JSON.parse(msg.payload);
    dbEventEmitter.emit(msg.channel, payload);
  });
  
  // Designate which channels we are listening on. Add additional channels with multiple lines.
  client.query('LISTEN new_order');


      //const result = await client.query('SELECT * FROM test_table');
      //const results = { 'results': (result) ? result.rows : null};
      //res.render('pages/db', results );
      res.render('pages/db', payload );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))


 
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000


const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgres://ilolhcujlhedox:2be8ff85d49d5b1022b4ff7b3c55a81f8c636d9b604ca8fc3df89bafcfa652ff@ec2-54-217-206-65.eu-west-1.compute.amazonaws.com:5432/d52bf94gqsc648',
  ssl: true
});

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/db', async (req, res) => {
    try {
      const client = await pool.connect()
      const result = await client.query('SELECT * FROM test_table');
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/db', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))


 
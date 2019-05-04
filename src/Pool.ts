const { Pool } = require('pg')
const dotenv = require('dotenv');

dotenv.config();
const connectionString: string = `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`;
console.log(connectionString);
console.log('****************************creating pool');
const pool = new Pool({ connectionString: connectionString});

module.exports = pool;
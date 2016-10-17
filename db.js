var db = require('knex')({
    client: 'pg',
    connection: {
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        ssl: true
    },
    pool: {
        min: process.env.DATABASE_POOL_MIN,
        max: process.env.DATABASE_POOL_MAX
    }
});

/*var DATABASE_URL = process.env.DATABASE_URL;
var DATABASE_SCHEMA = process.env.DATABASE_SCHEMA;

 var db = require('knex')({
     client: 'pg',
     connection: DATABASE_URL,
     searchPath: DATABASE_SCHEMA
 });*/

module.exports = db;
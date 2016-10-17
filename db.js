var db = require('knex')({
    client: 'pg',
    connection: {
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_SCHEMA,
        ssl: true
    },
    pool: {
        min: process.env.DATABASE_POOL_MIN,
        max: process.env.DATABASE_POOL_MAX
    }
});

module.exports = db;
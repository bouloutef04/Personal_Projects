const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "Ignancy2025$",
    host: "localhost",
    port: 5432,
    database: "gametracker"
});

module.exports = pool;
const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "",
    host: "localhost",
    port: 5000,
    database: "GameTracker"
});

module.exports = pool;
const { Pool } = require('pg');

const pool = new Pool({
    user: 'gerty',
    host: 'itcpostgresql.postgres.database.azure.com',
    database: 'db011',
    password: '%&unsas_aew27011',
    port: 5432,
    ssl: true
});

module.exports = pool; // exportando para usar nos outros arquivos
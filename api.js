const { Pool } = require('pg');
const express = require('express'); //importamos o express
const cors = require('cors');

const app = express(); // inicializo a minha instancia do express;

app.use(express.json()); // habilito o midleware de json do express;

app.use(cors());

const pool = new Pool({
    user: 'gerty',
    host: 'itcpostgresql.postgres.database.azure.com',
    database: 'db011',
    password: '%&unsas_aew27011',
    port: 5432,
    ssl: true
});

const showVacinasCount = async() => {
    const result = await pool.query('SELECT * from VACINA');
    return result.rows;
}
// console.log(pool.options.user);
// console.log(pool.options.database);
// showVacinasCount();

app.get('/vacinas', async (req, res) => {
    try {
        const result = await showVacinasCount();
        res.send(result);
    } catch (error) {
        console.error('Erro ao obter dados de vacinas:', error);
        res.status(500).send('Erro interno do servidor');
    }
});


const port = 3010;

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
})
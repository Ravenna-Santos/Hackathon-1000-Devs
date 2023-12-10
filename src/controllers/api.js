const pool  = require('../database/conection');

// VACINA, PERIODOAPLICACAOANO, PERIODOAPLICACAOMES e REDE


const showVacinas = async(req, res) => {
    const idParam = req.params.id;

    const result = await pool.query(`SELECT * 
    from VACINA as V
    left join PERIODOAPLICACAOMES as PM on PM.id_vacina = V.id_vacina
    left join PERIODOAPLICACAOMES as PA on PA.id_vacina = V.id_vacina
    left join REDE as R on V.id_rede = R.id_rede
    where V.id_vacina = ${req.params.id};`);
    res.send(result.rows);
}


// app.get('/vacinas', async (req, res) => {
//     try {
//         const result = await showVacinasCount();
//         res.send(result);
//     } catch (error) {
//         console.error('Erro ao obter dados de vacinas:', error);
//         res.status(500).send('Erro interno do servidor');
//     }
// });

module.exports = {
    showVacinas
}
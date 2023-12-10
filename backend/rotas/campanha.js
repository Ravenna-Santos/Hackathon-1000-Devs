const express = require('express');

//conexão com o banco de dados
const pool = require("../database/db");

//inicializa o express
const rotaCampanha = express.Router();



//Rota para cadastrar campanha
rotaCampanha.post('/add',async (req, res) => {
    console.log("=> endpoint /campanha/add/ requisitado");

    //obtem os dados no corpo da requisicao HTTP
    const campanha = req.body;

    try {
        //verifica se esta faltando algum campo obrigatorio
        console.log(campanha.data_inicio);
        if (!campanha ||!campanha.descricao || !campanha.data_inicio || !campanha.data_fim) {
            res.status(400).json({mensagem: 'Parametros incompletos.'})
        } else {
            //campo ok, monta o SQL
            sqlString = `INSERT INTO campanha (id_campanha, descricao, data_inicio, data_fim) `;
            sqlString += ` VALUES ((SELECT (max(id_campanha) + 1) codigo FROM campanha), $1, $2, $3)`
            
            //desafio: pense em como descobrir o maior valor existente na coluna id_paciente ai basta somar + 1 
            // let id = await pool.query(SELECT (max(id_paciente) + 1) codigo FROM paciente);
            // console.log(id);
            const result = await pool.query( sqlString, [campanha.descricao,campanha.data_inicio, campanha.data_fim]);

            if (result.rowCount > 0) {
                res.status(201).json({mensagem: 'Campanha cadastrada com sucesso.'});
            } else {
                res.status(400).json({mensagem: 'Erro ao cadastrar campanha.'});
            }
        }
    } catch (error) {  
        console.log(error);
        res.status(404).json({mensagem: 'Erro ao executar a insercao.'});
    }
})

/*
// Rota para cadastrar uma nova campanha
    rotaCampanha.post('/campanha/add', async (req, res) => {
    const campanha = req.body;

        try {
            const query = 'INSERT INTO campanhas (id_campanha, descricao, data_inicio, data_fim) VALUES ($1, $2, $3, $4) RETURNING *';
            const values = [id_campanha, descricao, data_inicio, data_fim];

            const result = await pool.query(query, values);

            res.status(201).json({ message: 'Campanha criada com sucesso', campanha: result.rows[0] });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao criar campanha' });
    }
});

*/
module.exports = rotaCampanha



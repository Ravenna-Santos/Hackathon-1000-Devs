const express = require('express');

//importa a conexao com o banco
const pool = require('../database/db.js');

//inicializa o express
const rotaAplicacaoMes = express.Router();

//rota para cadastro de periodo de aplicação por ano
rotaAplicacaoMes.post('/add',async (req, res) => {
    console.log(`=> endpoint /periodoaplicacaomes/add/ requisitado`);

    //obtem os dados no corpo da requisicao HTTP
    const periodoAplicacaoMes = req.body;

    try {
        //verifica se esta faltando algum campo obrigatorio
        if (!periodoAplicacaoMes || !periodoAplicacaoMes.id_vacina || !periodoAplicacaoMes.qtd_meses_inicial || !periodoAplicacaoMes.qtd_meses_final || !periodoAplicacaoMes.desc_meses) {
            res.status(400).json({mensagem: 'Parametros incompletos.'})
        } else {
            //campo ok, monta o SQL
            sqlString = `INSERT INTO periodoaplicacaomes (id, id_vacina, qtd_meses_inicial, qtd_meses_final, desc_meses) `;
            sqlString += ` VALUES ((SELECT (max(id) + 1) codigo FROM periodoaplicacaomes), $1, $2, $3, $4)`
            
            const result = await pool.query(sqlString, [periodoAplicacaoMes.id_vacina, periodoAplicacaoMes.qtd_meses_inicial, periodoAplicacaoMes.qtd_meses_final, periodoAplicacaoMes.desc_meses]);

            if (result.rowCount > 0) {
                res.status(201).json({mensagem: 'Período de Aplicação por Mês cadastrado com sucesso.'});
            } else {
                res.status(400).json({mensagem: 'Erro no cadastro do Período de Aplicação por Mês'});
            }
        }
    } catch (error) {  
        console.log(error);
        res.status(404).json({mensagem: 'Erro ao executar a insercao.'});
    }
})

/*rota para excluir um periodo de aplicação por ano*/
rotaAplicacaoMes.delete('/delete/:id',async (req, res) => {
    const id = req.params.id;

    console.log(`=> endpoint /periodoaplicacaomes/delete/${id} requisitado`);

    try {
        const result = await pool.query(`DELETE FROM periodoaplicacaomes WHERE id_vacina = $1`, [id] );

        if (result.rowCount > 0){
            res.status(200).json({mensagem: 'Vacina para Período de Aplicação por Ano excluido com sucesso.'});
        } else {
            res.status(404).json({mensagem: 'Vacina para Período de Aplicação por Ano nao encontrado.'});
        }
    } catch (error) {  
        console.log(error);
        res.status(404).json({mensagem: 'Erro ao executar a exclusao.'});
    }
})

module.exports = rotaAplicacaoMes; 
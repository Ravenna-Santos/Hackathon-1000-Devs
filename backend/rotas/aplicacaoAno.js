const express = require('express');

//importa a conexao com o banco
const pool = require('../database/db.js');
const rotaVacina = require('../rotas/vacina.js');

//inicializa o express
const rotaAplicacaoAno = express.Router();

//rota para cadastro de periodo de aplicação por ano
rotaAplicacaoAno.post('/add',async (req, res) => {
    console.log(`=> endpoint /periodoaplicacaoano/add/ requisitado`);

    //obtem os dados no corpo da requisicao HTTP
    const periodoAplicacaoAno = req.body;

    try {
        //verifica se esta faltando algum campo obrigatorio
        if (!periodoAplicacaoAno || !periodoAplicacaoAno.id_vacina || !periodoAplicacaoAno.qtd_ano_inicial || !periodoAplicacaoAno.qtd_ano_final || !periodoAplicacaoAno.desc_ano) {
            res.status(400).json({mensagem: 'Parametros incompletos.'})
        } else {
            //campo ok, monta o SQL
            sqlString = `INSERT INTO periodoaplicacaoano (id, id_vacina, qtd_ano_inicial, qtd_ano_final, desc_ano) `;
            sqlString += ` VALUES ((SELECT (max(id) + 1) codigo FROM periodoaplicacaoano), $1, $2, $3, $4)`
            
            const result = await pool.query(sqlString, [periodoAplicacaoAno.id_vacina, periodoAplicacaoAno.qtd_ano_inicial, periodoAplicacaoAno.qtd_ano_final, periodoAplicacaoAno.desc_ano]);

            if (result.rowCount > 0) {
                res.status(201).json({mensagem: 'Período de Aplicação por Ano cadastrado com sucesso.'});
            } else {
                res.status(400).json({mensagem: 'Erro no cadastro do Período de Aplicação por Ano'});
            }
        }
    } catch (error) {  
        console.log(error);
        res.status(404).json({mensagem: 'Erro ao executar a insercao.'});
    }
})

/*rota para excluir um periodo de aplicação por ano*/
rotaAplicacaoAno.delete('/delete/:id',async (req, res) => {
    const id = req.params.id;

    console.log(`=> endpoint /periodoaplicacaoano/delete/${id} requisitado`);

    try {
        const result = await pool.query(`DELETE FROM periodoaplicacaoano WHERE id_vacina = $1`, [id] );

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

module.exports = rotaAplicacaoAno; 
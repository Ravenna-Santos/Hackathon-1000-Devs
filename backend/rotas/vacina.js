const express = require('express');

//importa a conexao com o banco
const pool = require('../database/db.js');

//inicializa o express
const rotaVacina = express.Router();
/*
Consulta de vacina que
retorna todas as informações
da vacina, incluindo período
de aplicação e rede.
*/
rotaVacina.get('/:id', async (req, res) => {
    //obtem o parametro
    const id = req.params.id;

    console.log(`=> endpoint /vacina/${id} requisitado`);

    try {
        const vacina = await pool.query(`SELECT * 
        from VACINA as V
        left join PERIODOAPLICACAOMES as PM on PM.id_vacina = V.id_vacina
        left join PERIODOAPLICACAOANO as PA on PA.id_vacina = V.id_vacina
        left join REDE as R on V.id_rede = R.id_rede
        where V.id_vacina = ${id};`);

        //verifica se retornou alguma linha do banco de dados
        if (vacina.rowCount > 0){
            //se retornou devolve os dados com o status 200
            res.status(200).send(vacina.rows);
        } else {
            //caso nao retorne nenhuma linha o id nao existe
            res.status(404).json({mensagem: 'Vacina nao encontrado.'})
        }
    } catch (error) {    
        console.log(error);
        res.status(404).json({mensagem: 'Erro ao executar a consulta.'});
    }

})

/*
Uma consulta simples para listar todas
as vacinas que uma pessoa tomou.
*/
rotaVacina.get('/paciente/:id', async (req, res) => {
    //obtem o parametro
    const id = req.params.id;

    console.log(`=> endpoint /vacina/paciente/${id} requisitado`);

    try {
        const vacina = await pool.query(`SELECT v.vacina
        from paciente p 
        left join vacinaaplicada va on va.id_paciente = p.id_paciente 
        left join vacina v on v.id_vacina = va.id_vacina
        where p.id_paciente = ${id};`);

        //verifica se retornou alguma linha do banco de dados
        if (vacina.rowCount > 0){
            //se retornou devolve os dados com o status 200
            res.status(200).send(vacina.rows);
        } else {
            //caso nao retorne nenhuma linha o id nao existe
            res.status(404).json({mensagem: 'Vacina nao encontrado.'})
        }
    } catch (error) {    
        console.log(error);
        res.status(404).json({mensagem: 'Erro ao executar a consulta.'});
    }

})



module.exports = rotaVacina; 
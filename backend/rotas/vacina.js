const express = require('express');

//importa a conexao com o banco
const pool = require('../database/db.js');

//inicializa o express
const rotaVacina = express.Router();

// Consulta de vacina que retorna todas as informações da vacina, incluindo período de aplicação e rede.
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

/*Uma consulta simples para listar todas as vacinas que uma pessoa tomou.*/
rotaVacina.get('/paciente/:id', async (req, res) => {
    //obtem o parametro
    const id = req.params.id;

    console.log(`=> endpoint /vacina/paciente/${id} requisitado`);

    try {
        const vacina = await pool.query(`SELECT v.vacina, va.data_aplicacao
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
            res.status(404).json({mensagem: 'O paciente não possui vacinas aplicadas.'})
        }
    } catch (error) {    
        console.log(error);
        res.status(404).json({mensagem: 'Erro ao executar a consulta.'});
    }

})

/*Outra consulta para as vacinas pendentes de uma determinada pessoa*/
rotaVacina.get('/pedente/paciente/:id', async (req, res) => {
    //obtem o parametro
    const id = req.params.id;

    console.log(`=> endpoint /vacina/paciente/${id} requisitado`);

    try {
        const vacina = await pool.query(`select vacina.id_vacina,
        vacina.sigla_vacina,
        inicial,
        final,
        paciente.id_paciente 
        
 from vacina inner join (
     select  id_vacina, 
             (qtd_ano_inicial * 12) as inicial, 
             (qtd_ano_final * 12) as final
     from periodoaplicacaoano
     union 
     select  id_vacina, 
             qtd_meses_inicial as inicial, 
             qtd_meses_final as final
     from periodoaplicacaomes
 ) aplicacao on aplicacao.id_vacina = vacina.id_vacina
 INNER JOIN (SELECT EXTRACT(MONTH FROM age(now(), p.data_nascimento)) + 
             EXTRACT(YEAR FROM age(now(), p.data_nascimento)) * 12 AS idade_meses,
             p.id_paciente
             FROM paciente p) paciente on  paciente.idade_meses BETWEEN aplicacao.inicial AND aplicacao.final
         where vacina.id_vacina not in (SELECT va.id_vacina 
         from paciente p 
         left join vacinaaplicada va on va.id_paciente = p.id_paciente 
         left join vacina v on v.id_vacina = va.id_vacina
         where p.id_paciente = ${id})
         and paciente.id_paciente = ${id};`);

        //verifica se retornou alguma linha do banco de dados
        if (vacina.rowCount > 0){
            //se retornou devolve os dados com o status 200
            res.status(200).send(vacina.rows);
        } else {
            //caso nao retorne nenhuma linha o id nao existe
            res.status(404).json({mensagem: 'O paciente está com a caderneta de vacinação em dia.'})
        }
    } catch (error) {    
        console.log(error);
        res.status(404).json({mensagem: 'Erro ao executar a consulta.'});
    }

})

// Nova rota para pesquisa por proteção
rotaVacina.get('/doenca_protecao/:doenca', async (req, res) => {
    const doenca_protecao = req.params.doenca;

    try {
        sqlString = `(SELECT id_vacina, vacina FROM vacina WHERE doenca_protecao ILIKE '%${doenca_protecao}%')`;
        
        // Utilize $1 para substituir o valor do parâmetro diretamente na consulta
        const consulta = await pool.query(sqlString);
    
        // Verifica se retornou alguma linha do banco de dados
        if (consulta.rowCount > 0) {
            // Se retornou, devolve os dados com o status 200
            res.status(200).send(consulta.rows);
        } else {
            // Caso não retorne nenhuma linha, a doença não existe
            res.status(404).json({ mensagem: 'Doença não encontrada.' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: 'Erro ao executar a consulta.' });
    }
});




module.exports = rotaVacina; 
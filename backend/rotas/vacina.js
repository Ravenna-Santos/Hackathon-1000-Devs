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

/*
Outra consulta para as vacinas
pendentes de uma determinada pessoa
*/

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

/*
API de pesquisa de vacina por ano (exato)
*/
rotaVacina.get('/ano-exato/:ano', async (req, res) => {
    //obtem o parametro
    const ano = req.params.ano;

    console.log(`=> endpoint /vacina/ano-exato/${ano} requisitado`);

    try {
        const vacina = await pool.query(`select v.id_vacina, v.vacina,
        v.sigla_vacina, pa.qtd_ano_inicial, pa.qtd_ano_final  from vacina v
        inner join  PERIODOAPLICACAOANO PA on v.id_vacina = pa.id_vacina
        where pa.qtd_ano_inicial = ${ano};`);

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

/*API de pesquisa de vacina por ano (até)*/
rotaVacina.get('/ano-ate/:ano', async (req, res) => {
    //obtem o parametro
    const ano = req.params.ano;

    console.log(`=> endpoint /vacina/ano-ate/${ano} requisitado`);

    try {
        const vacina = await pool.query(`select v.id_vacina, v.vacina,
        v.sigla_vacina, pa.qtd_ano_inicial, pa.qtd_ano_final ,
        pm.qtd_meses_inicial
        from vacina v
        left join  PERIODOAPLICACAOANO PA on v.id_vacina = pa.id_vacina
        left join  PERIODOAPLICACAOMES PM on v.id_vacina = pm.id_vacina
        where pa.qtd_ano_inicial <= ${ano}
       or (pm.qtd_meses_inicial / 12) <= ${ano};`);

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
API de pesquisa de vacina por mes (exato)
*/
rotaVacina.get('/mes-exato/:mes', async (req, res) => {
    //obtem o parametro
    const mes = req.params.mes;

    console.log(`=> endpoint /vacina/mes-exato/${mes} requisitado`);

    try {
        const vacina = await pool.query(`select v.id_vacina, v.vacina,
        v.sigla_vacina, pm.qtd_meses_inicial , pm.qtd_meses_final from vacina v
        inner join  PERIODOAPLICACAOMES PM on v.id_vacina = pm.id_vacina
        where pm.qtd_meses_inicial = ${mes};`);

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

/*API de pesquisa de vacina por mes (até)*/
rotaVacina.get('/mes-ate/:mes', async (req, res) => {
    //obtem o parametro
    const mes = req.params.mes;

    console.log(`=> endpoint /vacina/ano-mes/${mes} requisitado`);

    try {
        const vacina = await pool.query(`select v.id_vacina, v.vacina,
        v.sigla_vacina, pm.qtd_meses_inicial , pm.qtd_meses_final from vacina v
        inner join  PERIODOAPLICACAOMES PM on v.id_vacina = pm.id_vacina
        where pm.qtd_meses_inicial <= ${mes};`);

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
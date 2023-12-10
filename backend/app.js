const express = require('express');
const rotaPaciente = require('./rotas/paciente.js');
const rotaVacina = require('./rotas/vacina.js');
const rotaAplicacaoAno = require('./rotas/aplicacaoAno.js');
const rotaAplicacaoMes = require('./rotas/aplicacaoMes.js');
const rotaCampanha = require('./rotas/campanha.js');

const app = express();

app.use(express.json());

app.use('/paciente', rotaPaciente);
app.use('/vacina', rotaVacina);
app.use('/aplicacaoAno', rotaAplicacaoAno);
app.use('/aplicacaoMes', rotaAplicacaoMes);
app.use('/campanha', rotaCampanha);


const port = 3000;

app.listen(port, () => {
    console.log("Running");
})

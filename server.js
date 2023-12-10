const express = require('express');
const router = require('./src/routes/routes.js');

const app = express();

app.use(express.json());

app.use(router)



const port = 3010;

app.listen(port, () => {
    console.log(`server rodando na porta ${port}`);
});
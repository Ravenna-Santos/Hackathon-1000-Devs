const { Router } = require('express');
const { showVacinas } = require('../controllers/api');

const router = Router();

router.get('/vacinas/:id', showVacinas);

module.exports = router;

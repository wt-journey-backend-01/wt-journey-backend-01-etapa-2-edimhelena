const express = require('express')
const router = express.Router();
const controller = require('../controllers/casosController')

router.get('/casos', controller.getCasos);
router.get('/casos/:id', controller.getCasosById)
router.post('/casos', controller.criarCaso)
router.put('/casos/:id', controller.atualizarCaso)
router.patch('/casos/:id', controller.atualizarCasoParcialmente)
router.delete('/casos/:id', controller.deletarCaso)

module.exports = router
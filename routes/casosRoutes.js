const express = require('express')
const router = express.Router();
const controller = require('../controllers/casosController')

router.get('/', controller.getCasos);
router.get('/:id', controller.getCasosById)
router.post('/', controller.criarCaso)
router.put('/:id', controller.atualizarCaso)
router.patch('/:id', controller.atualizarCasoParcialmente)
router.delete('/:id', controller.deletarCaso)

module.exports = router
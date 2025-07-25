const express = require('express')
const router = express.Router()
const controller = require('../controllers/agentesController')

router.get('/', controller.getAgentes);
router.get('/:id', controller.getAgentesById)
router.post('/', controller.criarAgente)
router.put('/:id', controller.atualizarAgente)
router.patch('/:id', controller.atualizarAgenteParcialmente)
router.delete('/:id', controller.deletarAgente)

module.exports = router
const express = require('express')
const router = express.Router()
const controller = require('../controllers/agentesController')

router.get('/agentes', controller.getAgentes);
router.get('/agentes/:id', controller.getAgentesById)
router.post('/agentes', controller.criarAgente)
router.put('/agentes/:id', controller.atualizarAgente)
router.patch('/agentes/:id', controller.atualizarAgenteParcialmente)
router.delete('/agentes/:id', controller.deletarAgente)

module.exports = router
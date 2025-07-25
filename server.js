//inicializando
const express = require('express');

const app = express();
const PORT = 3000;
const casosRouter = require('./routes/casosRoutes')
const agentesRouter = require('./routes/agentesRoutes')

app.use(express.json());

app.use('/casos', casosRouter)
app.use('/agentes', agentesRouter)

app.listen(PORT, () => {
    console.log(`Servidor do Departamento de Polícia rodando em localhost:${PORT}`)
})
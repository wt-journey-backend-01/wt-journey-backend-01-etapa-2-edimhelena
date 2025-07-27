const express = require('express');

const app = express();
const PORT = 3000;

const casosRouter = require('./routes/casosRoutes')
const agentesRouter = require('./routes/agentesRoutes')
const swaggerUi = require("swagger-ui-express")
const errorHandler = require('./utils/errorHandler')

app.use(express.json());

const swaggerDocs = require("./docs/swagger.json")
app.use('/api.docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
app.use('/casos', casosRouter)
app.use('/agentes', agentesRouter)
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Servidor do Departamento de Polícia rodando em localhost:${PORT}`)
})
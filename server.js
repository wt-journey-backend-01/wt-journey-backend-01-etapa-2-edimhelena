//inicializando
const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

app.use(express.json());

// BD
const casos = []

app.get('/casos', (req, res) => {
    let { agente_id, status } = req.query

    if (agente_id) {
        let casosAgente = casos.filter(c => c.agente_id === agente_id)

        if (casosAgente.length == 0) {
            return res.status(404).json({
                status: 404,
                message: "Esse agente não possui nenhum caso registrado"
            })
        }

        return res.status(200).json(casosAgente)
    }

    if (status) {

        if (status === 'aberto') {
            let casosAbertos = casos.filter(c => c.status === 'aberto')

            if (casosAbertos.length === 0) {
                return res.status(404).json({
                    status: 404,
                    message: "Nenhum caso aberto foi encontrado"
                })
            }

            return res.status(200).json(casosAbertos)
        }
        else if(status === 'solucionado'){
            let casosSolucionados = casos.filter(c => c.status === 'solucionado')

            if (casosSolucionados.length === 0) {
                return res.status(404).json({
                    status: 404,
                    message: "Nenhum caso solucionado foi encontrado"
                })
            }

            return res.status(200).json(casosSolucionados)
        }
        else{
            return res.status(400).json({
                status: 400,
                message: "O campo 'status' pode ser somente 'aberto' ou 'solucionado'",
            })
        }
    }

    if (casos.length == 0) {
        return res.status(404).json({
            status: 404,
            message: "Nenhum caso registrado"
        })
    }

    res.status(200).json(casos)
});

app.get('/casos/:id', (req, res) => {
    let id = req.params.id;
    let caso = casos.find(c => c.id === id);
    if (!caso) {
        return res.status(404).json({
            status: 404,
            message: `O caso ${id} não existe`
        })
    }

    res.status(200).json(caso);
});

app.put('/casos/:id', (req, res) => {
    let id = req.params.id;
    let { titulo, descricao, status } = req.body;

    let caso = casos.find(c => c.id === id);
    if (!caso) {
        return res.status(404).json({
            status: 404,
            message: `O caso ${id} não foi encontrado`
        })
    }

    if (!titulo) {
        return res.status(400).json({
            status: 400,
            message: `Título é obrigatório`
        })
    }

    if (!descricao) {
        return res.status(400).json({
            status: 400,
            message: `Descrição é obrigatória`
        })
    }

    if (status !== "aberto" && status !== "solucionado") {
        return res.status(400).json({
            status: 400,
            message: `Status deve ser 'aberto' ou 'solucionado'`
        })
    }

    caso.titulo = titulo,
        caso.descricao = descricao,
        caso.status = status;

    res.status(200).json(caso)
});

app.patch('/casos/:id', (req, res) => {
    let id = req.params.id;
    let caso = casos.find(c => c.id === id);
    if (!caso) {
        return res.status(404).json({
            status: 404,
            message: `O caso ${id} não foi encontrado`
        })
    }

    let { titulo, descricao, status } = req.body;

    if (status && status !== "aberto" && status !== "solucionado") {
        return res.status(400).json({
            status: 400,
            message: `Status deve ser 'aberto' ou 'solucionado'`
        })
    }

    if (titulo) {
        caso.titulo = titulo
    }
    if (descricao) {
        caso.descricao = descricao
    }
    if (status) {
        caso.status = status
    }

    res.status(200).json(caso);
})

app.post('/casos', (req, res) => {
    let { titulo } = req.body
    if (!titulo) {
        return res.status(400).json({
            status: 400,
            message: `Título é obrigatório`
        })
    }

    let { descricao } = req.body
    if (!descricao) {
        return res.status(400).json({
            status: 400,
            message: `Descrição é obrigatória`
        })
    }

    let { status } = req.body
    if (status !== "aberto" && status !== "solucionado") {
        return res.status(400).json({
            status: 400,
            message: `Status deve ser 'aberto' ou 'solucionado'`
        })
    }

    const newCaso = {
        id: uuidv4(),
        titulo,
        descricao,
        status,
        agente_id: uuidv4()
    }

    casos.push(newCaso);

    res.status(201).json(newCaso)
})

app.delete('/casos/:id', (req, res) => {
    let id = req.params.id;
    let caso = casos.find(c => c.id === id);
    if (!caso) {
        return res.status(404).json({
            status: 404,
            message: `O caso ${id} não existe`
        })
    }

    let indexCaso = casos.indexOf(c => c.id = id);
    casos.splice(indexCaso, 1);

    res.status(204).send();

})

app.listen(PORT, () => {
    console.log(`Servidor do Departamento de Polícia rodando em localhost:${PORT}`)
})
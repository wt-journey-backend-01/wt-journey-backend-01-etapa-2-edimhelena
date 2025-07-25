const { v4: uuidv4 } = require('uuid');

const casos = [
    {
        id: "f5fb2ad5-22a8-4cb4-90f2-8733517a0d46",
        titulo: "homicidio",
        descricao: "Disparos foram reportados às 22:33 do dia 10/07/2007 na região do bairro União, resultando na morte da vítima, um homem de 45 anos.",
        status: "aberto",
        agente_id: "401bccf5-cf9e-489d-8412-446cd169a0f1"

    },
]

const casoIndex = (id) =>  casos.findIndex(c => c.id === id);

const findAll = () => casos;

const findById = (id) => casos.find(c => c.id === id);

const criarCaso = (titulo, descricao, status, agente_id) => {
    const newCaso = {
        id: uuidv4(),
        titulo,
        descricao,
        status,
        agente_id
    }

    casos.push(newCaso);
    return newCaso
}

const atualizarCaso = (id, titulo, descricao, status, agente_id) => {
    const caso = casos.find(c => c.id === id);

    if (!caso) {
        return null
    }

    caso.titulo = titulo
    caso.descricao = descricao
    caso.status = status
    caso.agente_id = agente_id

    return caso
}

const atualizarCasoParcialmente = (titulo, descricao, status, agente_id) => {
    const caso = casos.find(c => c.id === id);

    if (!caso) {
        return null
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
    if(agente_id){
        caso.agente_id = agente_id
    }

    return caso
}

const deleteCaso = (indexCaso) => {
    return casos.splice(indexCaso, 1);
}

module.exports = {
    findAll,
    findById,
    criarCaso,
    atualizarCaso,
    deleteCaso,
    atualizarCasoParcialmente,
    casoIndex
}
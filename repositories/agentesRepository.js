const { v4: uuidv4 } = require('uuid');

const agentes = [];

const agentesIndex = (id) =>  agentes.findIndex(c => c.id === id);

const findAll = () => agentes;

const findById = (id) => agentes.find(a => a.id === id);

const cadastrarAgente = (nome, dataDeIncorporacao, cargo) => {
    const newAgente = {
        id: uuidv4(),
        nome,
        dataDeIncorporacao,
        cargo
    }

    agentes.push(newAgente);
    return newAgente;
}

const atualizarAgente = (id, nome, dataDeIncorporacao, cargo) => {
    const agente = agentes.find(a => a.id === id)
    if(!agente){
        return null
    }
    
    agente.nome = nome;
    agente.dataDeIncorporacao = dataDeIncorporacao;
    agente.cargo = cargo

    return agente
}

const atualizarAgenteParcialmente = (id, nome, dataDeIncorporacao, cargo) => {
    const agente = agentes.find(a => a.id === id)
    if(!agente){
        return null
    }
    
    if(nome){
        agente.nome = nome;
    }
    
    if(dataDeIncorporacao){
        agente.dataDeIncorporacao = dataDeIncorporacao;
    }
    
    if(cargo){
        agente.cargo = cargo
    }

    return agente
}

const deletarAgente = (indexAgente) => {
    return agentes.splice(indexAgente, 1);
}

module.exports = {
    findAll,
    findById,
    cadastrarAgente,
    atualizarAgente,
    atualizarAgenteParcialmente,
    deletarAgente,
    agentesIndex
}

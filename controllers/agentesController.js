const agentesRepository = require('../repositories/agentesRepository')

class APIError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
        this.name = 'APIError';
    }
}

const getAgentes = (req, res, next) => {
    try {
        const agentes = agentesRepository.findAll();

        res.status(200).json(agentes)
    }
    catch (error) {
        next(error)
    }
}

const getAgentesById = (req, res, next) => {
    const id = req.params.id
    const agente = agentesRepository.findById(id);

    if (!agente) {
        return next(new APIError(404, `Agente ${id} não encontrado`))
    }

    res.status(200).json(agente)
}

const criarAgente = (req, res, next) => {
    try {
        const { nome, dataDeIncorporacao, cargo } = req.body

        if (!nome) {
            return next(new APIError(400, `Nome é obrigatório`))
        }

        if (!dataDeIncorporacao) {
            return next(new APIError(400, `A data de incorporação é obrigatória`))
        }

        if (!cargo) {
            return next(new APIError(400, `Cargo é obrigatório`))
        }

        const formatoValido = /^\d{4}-\d{2}-\d{2}$/.test(dataDeIncorporacao)
        if (!formatoValido) {
            return next(new APIError(400, `Data de incorporação deve estar no formato YYYY-MM-DD`))
        }

        const newAgente = agentesRepository.cadastrarAgente(nome, dataDeIncorporacao, cargo);

        res.status(201).json(newAgente)
    }
    catch (error) {
        next(error)
    }
}

const atualizarAgente = (req, res, next) => {
    try {
        const id = req.params.id
        const { nome, dataDeIncorporacao, cargo } = req.body

        if (!nome) {
            return next(new APIError(400, `Nome é obrigatório`))
        }

        if (!dataDeIncorporacao) {
            return next(new APIError(400, `A data de incorporação é obrigatória`))
        }

        if (!cargo) {
            return next(new APIError(400, `Cargo é obrigatório`))
        }

        const formatoValido = /^\d{4}-\d{2}-\d{2}$/.test(dataDeIncorporacao)
        if (!formatoValido) {
            return next(new APIError(400, `Data de incorporação deve estar no formato YYYY-MM-DD`))
        }

        const agenteExiste = agentesRepository.findById();

        if (!agenteExiste) {
            return next(new APIError(404, `Agente ${id} não encontrado`))
        }

        const agente = agentesRepository.atualizarAgente(id, nome, dataDeIncorporacao, cargo)
        return res.status(200).json(agente)
    }
    catch (error) {
        next(error)
    }
}

const atualizarAgenteParcialmente = (req, res, next) => {
    try{
        const id = req.params.id
        const { nome, dataDeIncorporacao, cargo } = req.body

        const agenteExiste = agentesRepository.findById(id)

        if(!agenteExiste){
            return next(new APIError(404, `Agente ${id} não encontrado`))
        }

        const agenteAtualizado = agentesRepository.atualizarAgenteParcialmente(nome, dataDeIncorporacao, cargo)

        return res.status(200).json(agenteAtualizado)
    }
    catch(error){
        next(error)
    }
}

const deletarAgente = (req, res, next) => {
    try {
        let id = req.params.id;
        let indexAgente = agentesRepository.agentesIndex(id)
        if (indexAgente === -1) {
            return next(new APIError(404, `O agente ${id} não foi encontrado`))
        }
        agentesRepository.deletarAgente(indexAgente)
        res.status(204).send();
    }
    catch (error) {
        next(error)
    }
}

module.exports = {
    getAgentes,
    getAgentesById,
    criarAgente,
    atualizarAgente,
    atualizarAgenteParcialmente,
    deletarAgente
}
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

        return res.status(200).json(agentes)
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

    return res.status(200).json(agente)
}

const criarAgente = (req, res, next) => {
    try {
        const { nome, dataDeIncorporacao, cargo } = req.body

        if (!nome || nome === "") {
            return next(new APIError(400, `Nome é obrigatório`))
        }

        if (!dataDeIncorporacao || dataDeIncorporacao === "") {
            return next(new APIError(400, `A data de incorporação é obrigatória`))
        }

        if (!cargo || cargo === "") {
            return next(new APIError(400, `Cargo é obrigatório`))
        }

        const formatoValido = /^\d{4}-\d{2}-\d{2}$/.test(dataDeIncorporacao)
        if (!formatoValido) {
            return next(new APIError(400, `Data de incorporação deve estar no formato YYYY-MM-DD`))
        }

        const now = new Date();
        const dataToDate = new Date(dataDeIncorporacao)

        if (dataToDate > now) {
            return next(new APIError(400, "A data de incorporação deve ser uma data válida."));
        }

        const newAgente = agentesRepository.cadastrarAgente(nome, dataDeIncorporacao, cargo);

        return res.status(201).json(newAgente)
    }
    catch (error) {
        next(error)
    }
}

const atualizarAgente = (req, res, next) => {
    try {
        const id = req.params.id
        const { nome, dataDeIncorporacao, cargo } = req.body

        if ('id' in req.body) {
            return next(new APIError(400, "Você não pode alterar o campo 'id'."));
        }

        if (nome === undefined || nome === "") {
            return next(new APIError(400, `Nome é obrigatório`))
        }

        if (dataDeIncorporacao === undefined || dataDeIncorporacao === "") {
            return next(new APIError(400, `A data de incorporação é obrigatória`))
        }

        if (cargo === undefined || cargo === "") {
            return next(new APIError(400, `Cargo é obrigatório`))
        }

        const formatoValido = /^\d{4}-\d{2}-\d{2}$/.test(dataDeIncorporacao)
        if (!formatoValido) {
            return next(new APIError(400, `Data de incorporação deve estar no formato YYYY-MM-DD`))
        }

        const now = new Date();
        const dataToDate = new Date(dataDeIncorporacao)

        if (dataToDate > now) {
            return next(new APIError(400, "A data de incorporação deve ser uma data válida."));
        }

        const agenteExiste = agentesRepository.findById(id);

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
    try {
        const id = req.params.id
        const { nome, dataDeIncorporacao, cargo } = req.body

        if ('id' in req.body) {
            return next(new APIError(400, "Você não pode alterar o campo 'id'."));
        }

        const agenteExiste = agentesRepository.findById(id)

        if (!agenteExiste) {
            return next(new APIError(404, `Agente ${id} não encontrado`))
        }

        if (nome !== undefined && (typeof nome !== 'string' || nome.trim() === "")) {
            return next(new APIError(400, `Nome deve ser uma string não vazia`));
        }

        if (cargo !== undefined && (typeof cargo !== 'string' || cargo.trim() === "")) {
            return next(new APIError(400, `Cargo deve ser uma string não vazia`));
        }

        if (dataDeIncorporacao !== undefined) {
            if (typeof dataDeIncorporacao !== 'string' || dataDeIncorporacao.trim() === "") {
                return next(new APIError(400, `Data de incorporação deve ser uma string no formato YYYY-MM-DD`));
            }

            const formatoValido = /^\d{4}-\d{2}-\d{2}$/.test(dataDeIncorporacao);
            if (!formatoValido) {
                return next(new APIError(400, `Data de incorporação deve estar no formato YYYY-MM-DD`));
            }

            const now = new Date();
            const dataToDate = new Date(dataDeIncorporacao);

            if (dataToDate > now) {
                return next(new APIError(400, "A data de incorporação deve ser uma data válida."));
            }
        }

        const agenteAtualizado = agentesRepository.atualizarAgenteParcialmente(id, nome, dataDeIncorporacao, cargo)

        return res.status(200).json(agenteAtualizado)
    }
    catch (error) {
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
        return res.status(204).send();
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
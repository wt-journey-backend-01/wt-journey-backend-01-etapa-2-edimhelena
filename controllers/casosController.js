const repository = require('../repositories/casosRepository');
const agentesRepository = require('../repositories/agentesRepository')

class APIError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
        this.name = 'APIError';
    }
}

const getCasos = (req, res, next) => {
    try {
        const casos = repository.findAll();

        return res.status(200).json(casos)
    }
    catch (error) {
        next(error)
    }
}

const getCasosById = (req, res, next) => {
    try {
        const id = req.params.id
        const caso = repository.findById(id)

        if (!caso) {
            return next(new APIError(404, `O caso ${id} não existe`))
        }

        return res.status(200).json(caso);
    }
    catch (error) {
        next(error)
    }
}

const criarCaso = (req, res, next) => {
    try {
        let { titulo } = req.body
        if (!titulo) {
            return next(new APIError(400, `Título é obrigatório`))
        }

        let { descricao } = req.body
        if (!descricao) {
            return next(new APIError(400, `Descrição é obrigatória`))
        }

        let { status } = req.body
        if (status !== "aberto" && status !== "solucionado") {
            return next(new APIError(400, `Status deve ser 'aberto' ou 'solucionado'`))
        }

        let { agente_id } = req.body
        if (!agente_id) {
            return next(new APIError(400, `ID do agente é obrigatório`))
        }

        const agenteExiste = agentesRepository.findById(agente_id);
        if (!agenteExiste) {
            return next(new APIError(404, 'Agente não encontrado'))
        }

        const newCaso = repository.criarCaso(titulo, descricao, status, agente_id)

        return res.status(201).json(newCaso)
    }
    catch (error) {
        next(error)
    }
}

const atualizarCaso = (req, res, next) => {
    try {
        let id = req.params.id;
        let { titulo, descricao, status, agente_id } = req.body;

        let caso = repository.findById(id);
        if (!caso) {
            return next(new APIError(404, `O caso ${id} não foi encontrado`))
        }

        if (!titulo) {
            return next(new APIError(400, `Título é obrigatório`))
        }

        if (!descricao) {
            return next(new APIError(400, `Descrição é obrigatória`))
        }

        if (status !== "aberto" && status !== "solucionado") {
            return next(new APIError(400, `Status deve ser 'aberto' ou 'solucionado'`))
        }

        if (!agente_id) {
            return next(new APIError(400, `ID do agente é obrigatório`))
        }

        const agenteExiste = agentesRepository.findById(agente_id);
        if (!agenteExiste) {
            return next(new APIError(404, 'Agente não encontrado'))
        }

        const casoAtualizado = repository.atualizarCaso(id, titulo, descricao, status, agente_id)

        return res.status(200).json(casoAtualizado)
    }
    catch (error) {
        next(error)
    }
}

const atualizarCasoParcialmente = (req, res, next) => {
    try {
        let id = req.params.id;
        let caso = repository.findById(id);
        if (!caso) {
            return next(new APIError(404, `O caso ${id} não foi encontrado`))
        }

        let { titulo, descricao, status, agente_id } = req.body;

        if (status && status !== "aberto" && status !== "solucionado") {
            return next(new APIError(400, `Status deve ser 'aberto' ou 'solucionado'`))
        }

        if (agente_id && !agentesRepository.findById(agente_id)) {
            return next(new APIError(404, 'Agente não encontrado'))
        }

        const casoAtualizado = repository.atualizarCasoParcialmente(id, titulo, descricao, status, agente_id)

        return res.status(200).json(casoAtualizado);
    }
    catch (error) {
        next(error)
    }
}

const deletarCaso = (req, res, next) => {
    try {
        let id = req.params.id;
        let indexCaso = repository.casoIndex(id)
        if (indexCaso === -1) {
            return next(new APIError(404, `O caso ${id} não foi encontrado`))
        }
        repository.deleteCaso(indexCaso)
        return res.status(204).send();
    }
    catch (error) {
        next(error)
    }
}

module.exports = {
    getCasos,
    getCasosById,
    criarCaso,
    atualizarCaso,
    atualizarCasoParcialmente,
    deletarCaso
}
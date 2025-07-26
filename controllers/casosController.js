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

        const { agente_id, status } = req.query

        if (agente_id) {
            const casosAgente = casos.filter(c => c.agente_id === agente_id)

            if (casosAgente.length === 0) {
                return next(new APIError(404, 'Esse agente não possui nenhum caso registrado.'))
            }

            return res.status(200).json(casosAgente)
        }

        if (status) {
            if (status === 'aberto') {
                let casosAbertos = casos.filter(c => c.status === 'aberto')

                if (casosAbertos.length === 0) {
                    return next(new APIError(404, "Nenhum caso aberto foi encontrado."))
                }

                return res.status(200).json(casosAbertos)
            }
            else if (status === 'solucionado') {
                let casosSolucionados = casos.filter(c => c.status === 'solucionado')

                if (casosSolucionados.length === 0) {
                    return next(new APIError(404, "Nenhum caso solucionado foi encontrado."))
                }

                return res.status(200).json(casosSolucionados)
            }
            else {
                return next(new APIError(400, "O campo 'status' pode ser somente 'aberto' ou 'solucionado'."))
            }
        }

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
        if (!titulo || titulo === "") {
            return next(new APIError(400, `Título é obrigatório`))
        }

        let { descricao } = req.body
        if (!descricao || descricao === "") {
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

        if ('id' in req.body) {
            return next(new APIError(400, "Você não pode alterar o campo 'id'."));
        }

        let caso = repository.findById(id);
        if (!caso) {
            return next(new APIError(404, `O caso ${id} não foi encontrado`));
        }

        if (typeof titulo !== 'string' || titulo.trim() === '') {
            return next(new APIError(400, `Título é obrigatório e deve ser uma string não vazia`));
        }

        if (typeof descricao !== 'string' || descricao.trim() === '') {
            return next(new APIError(400, `Descrição é obrigatória e deve ser uma string não vazia`));
        }

        if (typeof status !== 'string' || status.trim() === '') {
            return next(new APIError(400, `Status é obrigatório e deve ser uma string não vazia`));
        }
        if (status !== "aberto" && status !== "solucionado") {
            return next(new APIError(400, `Status deve ser 'aberto' ou 'solucionado'`));
        }

        if (agente_id === undefined || agente_id === null || agente_id === '') {
            return next(new APIError(400, `ID do agente é obrigatório`));
        }

        const agenteExiste = agentesRepository.findById(agente_id);
        if (!agenteExiste) {
            return next(new APIError(404, 'Agente não encontrado'));
        }

        const casoAtualizado = repository.atualizarCaso(id, titulo, descricao, status, agente_id);
        return res.status(200).json(casoAtualizado);
    }
    catch (error) {
        next(error);
    }
};


const atualizarCasoParcialmente = (req, res, next) => {
    try {
        let id = req.params.id;
        let caso = repository.findById(id);



        if ('id' in req.body) {
            return next(new APIError(400, "Você não pode alterar o campo 'id'."));
        }

        if (!caso) {
            return next(new APIError(404, `O caso ${id} não foi encontrado`))
        }

        let { titulo, descricao, status, agente_id } = req.body;

        if (titulo !== undefined && (typeof titulo !== 'string' || titulo.trim() === '')) {
            return next(new APIError(400, `Título deve ser uma string não vazia`));
        }

        if (descricao !== undefined && (typeof descricao !== 'string' || descricao.trim() === '')) {
            return next(new APIError(400, `Descrição deve ser uma string não vazia`));
        }

        if (status !== undefined) {
            if (typeof status !== 'string' || status.trim() === "") {
                return next(new APIError(400, `Status deve ser uma string não vazia`));
            }

            if (status !== "aberto" && status !== "solucionado") {
                return next(new APIError(400, `Status deve ser 'aberto' ou 'solucionado'`));
            }
        }


        if (agente_id !== undefined && !agentesRepository.findById(agente_id)) {
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
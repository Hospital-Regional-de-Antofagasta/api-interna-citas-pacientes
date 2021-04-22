const HorasMedicas = require('../models/HorasMedicas')

exports.getLast = async (req, res) => {
    try {
        const horaMedica = await HorasMedicas.findOne()
            .sort({ CorrelativoHora: -1 }).exec()
        res.status(200).send(horaMedica)
    } catch (error) {
        res.status(500).send(`Horas Medicas: ${error.name} - ${error.message}`)
    }
}

exports.create = async (req, res) => {
    try {
        await HorasMedicas.create(req.body)
        res.sendStatus(201)
    } catch (error) {
        res.status(500).send(`Horas Medicas: ${error.name} - ${error.message}`)
    }
}

exports.delete = async (req, res) => {
    try {
        const filter = { CorrelativoHora: req.params.correlativoHora}
        await HorasMedicas.deleteOne(filter).exec()
        res.sendStatus(204)
    } catch (error) {
        res.status(500).send(`Horas Medicas: ${error.name} - ${error.message}`)
    }
}
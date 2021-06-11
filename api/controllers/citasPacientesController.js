const CitasPacientes = require('../models/CitasPacientes')
const moment = require ('moment')


exports.getLast = async (req, res) => {
    try {
        const citaPaciente = await CitasPacientes.findOne()
            .sort({ correlativoCita: -1 }).exec()
        res.status(200).send(citaPaciente)
    } catch (error) {
        res.status(500).send(`Citas Pacientes: ${error.name} - ${error.message}`)
    }
}

exports.create = async (req, res) => {
    try {
        const citas = req.body
        citas.forEach(cita => {
            cita.fechaCitacion = moment(cita.fechaCitacion).startOf('day')
        });
        await CitasPacientes.create(req.body)
        res.sendStatus(201)
    } catch (error) {
        res.status(500).send(`Citas Pacientes: ${error.name} - ${error.message}`)
    }
}

exports.delete = async (req, res) => {
    try {
        const filter = { correlativoCita: req.params.correlativoCita}
        await CitasPacientes.deleteOne(filter).exec()
        res.sendStatus(204)
    } catch (error) {
        res.status(500).send(`Citas Pacientes: ${error.name} - ${error.message}`)
    }
}



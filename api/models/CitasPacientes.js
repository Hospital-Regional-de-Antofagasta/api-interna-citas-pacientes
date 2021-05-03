const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CitasPacientes = mongoose.model('citas_paciente', new Schema ({
    correlativoCita: {
        type: Number,
        require: true,
        unique: true,
    },
    nombreLugar: String,
    nombreServicio: String,
    nombreProfesional: String,
    fechaCitacion: Date,
    horaCitacion: String,
    numeroPaciente: Number,
    codigoAmbito: String,
}, { timestamps: true }))

module.exports = CitasPacientes
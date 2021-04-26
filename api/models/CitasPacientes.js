const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CitasPacientes = mongoose.model('citas_paciente', new Schema ({
    CorrelativoCita: {
        type: Number,
        require: true,
        unique: true,
    },
    NombreLugar: String,
    NombreServicio: String,
    NombreProfesional: String,
    FechaCitacion: Date,
    HoraCitacion: String,
    NumeroPaciente: Number,
    CodigoAmbito: String,
}, { timestamps: true }))

module.exports = CitasPacientes
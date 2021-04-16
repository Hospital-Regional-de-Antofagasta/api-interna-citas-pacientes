const mongoose = require('mongoose')
const Schema = mongoose.Schema

const HoraMedica = mongoose.model('horas_medica', new Schema ({
    CorrelativoHora: {
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
}))

module.exports = HoraMedica
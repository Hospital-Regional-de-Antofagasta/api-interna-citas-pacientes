const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const env = process.env.NODE_ENV;

let db = "hrapp"

if(env==="test") db = `${db}_test`

const conection = mongoose.connection.useDb(db);

const CitasPacientes = conection.model(
  "citas_paciente",
  new Schema(
    {
      correlativoCita: {
        type: Number,
        require: true,
        unique: true,
      },
      nombreLugar: String,
      codigoServicio: String,
      nombreServicio: String,
      codigoProfesional: String,
      nombreProfesional: String,
      fechaCitacion: Date,
      horaCitacion: String,
      numeroPaciente: {type: Number, require: true},
      codigoAmbito: String,
      tipoCita: String,
      alta: { type: Boolean, default: false },
      blockedAt: Date,
    },
    { timestamps: true }
  )//.index({'numeroPaciente.numero':1,'numeroPaciente.codigoEstablecimiento':1},{unique: true})
);

module.exports = CitasPacientes;
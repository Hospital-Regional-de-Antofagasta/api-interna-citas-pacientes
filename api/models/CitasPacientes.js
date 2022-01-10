const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const env = process.env.NODE_ENV;

let db = "hrapp_citas_pacientes"

if(env==="test") db = `${db}_test`

const conection = mongoose.connection.useDb(db);

const CitasPacientes = conection.model(
  "citas_paciente",
  new Schema(
    {
      correlativo: { type: Number, require: true },
      codigoLugar: { type: String, require: true },
      nombreLugar: String,
      codigoServicio: { type: String, require: true },
      nombreServicio: String,
      codigoProfesional: { type: String, require: true },
      nombreProfesional: String,
      tipo: { type: String, require: true },
      codigoAmbito: { type: String, require: true },
      fechaCitacion: { type: Date, require: true },
      horaCitacion: { type: String, require: true },
      rutPaciente: { type: String, require: true },
      alta: { type: Boolean, default: false },
      bloqueadaEl: Date,
      codigoEstablecimiento: { type: String, require: true },
      nombreEstablecimiento: { type: String, require: true },
    },
    { timestamps: true }
  )
);

module.exports = CitasPacientes;

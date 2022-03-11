const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const env = process.env.NODE_ENV;

let db = "hrapp_citas_pacientes";

if (env === "test") db = `${db}_test`;

const conection = mongoose.connection.useDb(db);

const CitasPacientes = conection.model(
  "citas_paciente",
  new Schema(
    {
      correlativo: { type: Number, required: true },
      codigoLugar: { type: String, required: true },
      nombreLugar: String,
      codigoServicio: { type: String, required: true },
      nombreServicio: String,
      codigoProfesional: { type: String, required: true },
      nombreProfesional: String,
      tipo: { type: String, required: true },
      codigoAmbito: { type: String, required: true },
      fechaCitacion: { type: Date, required: true },
      horaCitacion: { type: String, required: true },
      rutPaciente: { type: String, required: true },
      alta: { type: Boolean, default: false },
      bloqueadaEl: Date,
      codigoEstablecimiento: { type: String, required: true },
      nombreEstablecimiento: { type: String, required: true },
    },
    { timestamps: true }
  )
);

module.exports = CitasPacientes;

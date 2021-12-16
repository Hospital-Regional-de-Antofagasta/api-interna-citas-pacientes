const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CitasPacientes = mongoose.model(
  "citas_paciente",
  new Schema(
    {
      correlativo: { type: Number, require: true },
      codigoLugar: String,
      nombreLugar: String,
      codigoServicio: String,
      nombreServicio: String,
      codigoProfesional: String,
      nombreProfesional: String,
      tipo: String,
      codigoAmbito: String,
      fechaCitacion: Date,
      horaCitacion: String,
      rutPaciente: { type: String, require: true },
      alta: { type: Boolean, default: false },
      bloqueadaEl: Date,
      codigoEstablecimiento: String,
      nombreEstablecimiento: String,
    },
    { timestamps: true }
  )
);

module.exports = CitasPacientes;

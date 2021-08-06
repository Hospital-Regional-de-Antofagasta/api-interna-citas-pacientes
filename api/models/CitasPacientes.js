const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CitasPacientes = mongoose.model(
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
      numeroPaciente: {
        numero: {type: Number, require: true, unique: true},
        codigoEstablecimiento: {type: String, require: true, unique: true},
        nombreEstablecimiento: String,
      },
      codigoAmbito: String,
      tipoCita: String,
      alta: { type: Boolean, default: false },
      blockedAt: Date,
    },
    { timestamps: true }
  )
);

module.exports = CitasPacientes;

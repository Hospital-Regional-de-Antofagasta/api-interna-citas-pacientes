const CitasPacientes = require("../models/CitasPacientesOld");

exports.getLast = async (req, res) => {
  try {
    const citaPaciente = await CitasPacientes.findOne()
      .sort({ correlativoCita: -1 })
      .exec();
    res.status(200).send(citaPaciente);
  } catch (error) {
    res.status(500).send(`Citas Pacientes: ${error.name} - ${error.message}`);
  }
};

exports.create = async (req, res) => {
  try {
    const citas = req.body;
    await CitasPacientes.create(citas);
    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(`Citas Pacientes: ${error.name} - ${error.message}`);
  }
};

exports.update = async (req, res) => {
  try {
    const filtro = {
      correlativoCita: req.params.correlativoCita,
    };
    const {
      nombreLugar,
      nombreServicio,
      nombreProfesional,
      fechaCitacion,
      horaCitacion,
      codigoServicio,
      codigoProfesional,
      blockedAt,
      alta,
    } = req.body;
    const modificacionesCita = {
      nombreLugar,
      nombreServicio,
      nombreProfesional,
      fechaCitacion,
      horaCitacion,
      codigoServicio,
      codigoProfesional,
      blockedAt,
      alta,
    };
    await CitasPacientes.updateOne(filtro, modificacionesCita).exec();
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send(`Citas Pacientes: ${error.name} - ${error.message}`);
  }
};

exports.delete = async (req, res) => {
  try {
    const filtro = {
      correlativoCita: req.params.correlativoCita,
    };
    await CitasPacientes.deleteOne(filtro).exec();
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send(`Citas Pacientes: ${error.name} - ${error.message}`);
  }
};
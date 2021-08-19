const CitasPacientes = require("../models/CitasPacientes");

exports.getLast = async (req, res) => {
  try {
    const citaPaciente = await CitasPacientes.findOne({
      "numeroPaciente.codigoEstablecimiento": req.params.codigoEstablecimiento,
    })
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
    const hospital = {};
    let propiedad = "";
    if (Array.isArray(citas)) {
      citas.forEach((cita) => {
        propiedad = `${cita.numeroPaciente.codigoEstablecimiento}`;
        hospital[propiedad] = 1;
        cita.numeroPaciente.hospital = hospital;
      });
    } else {
      //Sólo un objeto
      propiedad = `${citas.numeroPaciente.codigoEstablecimiento}`;
      hospital[propiedad] = 1;
      citas.numeroPaciente.hospital = hospital;
    }
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
      "numeroPaciente.codigoEstablecimiento": req.params.codigoEstablecimiento,
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
      "numeroPaciente.codigoEstablecimiento": req.params.codigoEstablecimiento,
    };
    await CitasPacientes.deleteOne(filtro).exec();
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send(`Citas Pacientes: ${error.name} - ${error.message}`);
  }
};

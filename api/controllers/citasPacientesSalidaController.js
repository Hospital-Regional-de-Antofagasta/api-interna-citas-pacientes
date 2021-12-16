const CitasPacientes = require("../models/CitasPacientes");

exports.create = async (req, res) => {
  const citasPacientesInsertadas = [];
  try {
    const citasPacientes = req.body;
    for (let citaPaciente of citasPacientes) {
      try {
        const citasPacientesMismoIdentificador = await CitasPacientes.find({
          $and: [
            { correlativo: citaPaciente.correlativo },
            { codigoEstablecimiento: citaPaciente.codigoEstablecimiento },
          ],
        }).exec();
        // si existen multiples citasPacientes con el mismo identificador, indicar el error
        if (citasPacientesMismoIdentificador.length > 1) {
          citasPacientesInsertadas.push({
            afectado: citaPaciente.correlativo,
            realizado: false,
            error: `Existen ${citasPacientesMismoIdentificador.length} citas de pacientes con el correlativo ${citaPaciente.correlativo} para el establecimiento ${citaPaciente.codigoEstablecimiento}.`,
          });
          continue;
        }
        // si ya existe la citaPaciente, indicar el error y decir que se inserto
        if (citasPacientesMismoIdentificador.length === 1) {
          citasPacientesInsertadas.push({
            afectado: citaPaciente.correlativo,
            realizado: true,
            error: "La cita del paciente ya existe.",
          });
          continue;
        }
        // si la citaPaciente no existe, se inserta
        await CitasPacientes.create(citaPaciente);
        citasPacientesInsertadas.push({
          afectado: citaPaciente.correlativo,
          realizado: true,
          error: "",
        });
      } catch (error) {
        citasPacientesInsertadas.push({
          afectado: citaPaciente.correlativo,
          realizado: false,
          error: `${error.name} - ${error.message}`,
        });
      }
    }
    res.status(201).send({
      respuesta: citasPacientesInsertadas,
    });
  } catch (error) {
    res.status(500).send({
      error: `CitasPacientes create: ${error.name} - ${error.message}`,
      respuesta: citasPacientesInsertadas,
    });
  }
};

exports.updateMany = async (req, res) => {
  const citasPacientesActualizadas = [];
  try {
    const citasPacientes = req.body;
    for (let citaPaciente of citasPacientes) {
      try {
        const citasPacientesMismoIdentificador = await CitasPacientes.find({
          $and: [
            { correlativo: citaPaciente.correlativo },
            { codigoEstablecimiento: citaPaciente.codigoEstablecimiento },
          ],
        }).exec();
        // si la citaPaciente no existe, reportar el error
        if (citasPacientesMismoIdentificador.length === 0) {
          citasPacientesActualizadas.push({
            afectado: citaPaciente.correlativo,
            realizado: false,
            error: "La cita del paciente no existe.",
          });
          continue;
        }
        // si existen multiples citasPacientes con el mismo identificador, indicar el error
        if (citasPacientesMismoIdentificador.length > 1) {
          citasPacientesActualizadas.push({
            afectado: citaPaciente.correlativo,
            realizado: false,
            error: `Existen ${citasPacientesMismoIdentificador.length} citas de pacientes con el correlativo ${citaPaciente.correlativo} para el establecimiento ${citaPaciente.codigoEstablecimiento}.`,
          });
          continue;
        }
        // si solo encontro una para actualizar, la actualiza
        const response = await CitasPacientes.updateOne(
          {
            correlativo: citaPaciente.correlativo,
            codigoEstablecimiento: citaPaciente.codigoEstablecimiento,
          },
          citaPaciente
        ).exec();
        citasPacientesActualizadas.push({
          afectado: citaPaciente.correlativo,
          realizado: response.modifiedCount ? true : false,
          error: response.modifiedCount
            ? ""
            : "La cita del paciente no fue actualizada.",
        });
      } catch (error) {
        citasPacientesActualizadas.push({
          afectado: citaPaciente.correlativo,
          realizado: false,
          error: `${error.name} - ${error.message}`,
        });
      }
    }
    res.status(200).send({
      respuesta: citasPacientesActualizadas,
    });
  } catch (error) {
    res.status(500).send({
      error: `CitasPacientes delete: ${error.name} - ${error.message}`,
      respuesta: citasPacientesActualizadas,
    });
  }
};

exports.deleteMany = async (req, res) => {
  const citasPacientesEliminados = [];
  try {
    const identificadoresCitasPacientes = req.body;
    for (let identificadorDocumento of identificadoresCitasPacientes) {
      try {
        const citasPacientesMismoIdentificador = await CitasPacientes.find({
          $and: [
            { correlativo: identificadorDocumento.correlativo },
            {
              codigoEstablecimiento:
                identificadorDocumento.codigoEstablecimiento,
            },
          ],
        }).exec();
        // si el citaPaciente no existe, reportar el error e indicar que se elimino
        if (citasPacientesMismoIdentificador.length === 0) {
          citasPacientesEliminados.push({
            afectado: identificadorDocumento.correlativo,
            realizado: true,
            error: "La cita del paciente no existe.",
          });
          continue;
        }
        // si existen multiples citasPacientes con el mismo identificador, indicar el error
        if (citasPacientesMismoIdentificador.length > 1) {
          citasPacientesEliminados.push({
            afectado: identificadorDocumento.correlativo,
            realizado: false,
            error: `Existen ${citasPacientesMismoIdentificador.length} citas de pacientes con el correlativo ${citaPaciente.correlativo} para el establecimiento ${citaPaciente.codigoEstablecimiento}.`,
          });
          continue;
        }
        // si solo encontro un citaPaciente para eliminar, lo elimina
        const response = await CitasPacientes.deleteOne(
          identificadorDocumento
        ).exec();
        citasPacientesEliminados.push({
          afectado: identificadorDocumento.correlativo,
          realizado: response.deletedCount ? true : false,
          error: response.deletedCount ? "" : "La cita del paciente no fue eliminado.",
        });
      } catch (error) {
        citasPacientesEliminados.push({
          afectado: identificadorDocumento.correlativo,
          realizado: false,
          error: `${error.name} - ${error.message}`,
        });
      }
    }
    res.status(200).send({
      respuesta: citasPacientesEliminados,
    });
  } catch (error) {
    res.status(500).send({
      error: `CitasPacientes delete: ${error.name} - ${error.message}`,
      respuesta: citasPacientesEliminados,
    });
  }
};

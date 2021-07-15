const SolicitudesAnularCambiarCitasPacientes = require("../models/SolicitudesAnularCambiarCitasPacientes");

exports.getNuevasSolicitudesAnularCambiarCitasPacientes = async (req, res) => {
  try {
    const solicitudesAnularCambiarCitasPacientes =
      await SolicitudesAnularCambiarCitasPacientes.find({
        enviadaHospital: false,
      })
        .sort({ createdAt: 1 })
        .limit(100)
        .exec();
    res.status(200).send(solicitudesAnularCambiarCitasPacientes);
  } catch (error) {
    res.status(500).send({
      respuesta: `Pacientes update: ${error.name} - ${error.message}`,
    });
  }
};

exports.updateEstadoSolicitudesAnularCambiarCitasPacientes = async (
  req,
  res
) => {
  try {
    const idSolicitud = req.params.idSolicitud;
    const { _id, correlativoSolicitud, respondida, motivo, detallesMotivo } =
      req.body;
    const modificacionesSolicitud = {
      correlativoSolicitud,
      motivo,
      detallesMotivo,
      respondida,
    };
    const solicitudActualizada =
      await SolicitudesAnularCambiarCitasPacientes.findByIdAndUpdate(
        idSolicitud,
        modificacionesSolicitud
      ).exec();
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send({
      respuesta: `Update Solicitudes Anular/Cambiar Citas Pacientes: ${error.name} - ${error.message}`,
    });
  }
};

exports.deleteSolicitudesAnularCambiarCitasPacientes = async (req, res) => {
  try {
    const idSolicitud = req.params.idSolicitud;
    const solicitudEliminada =
      await SolicitudesAnularCambiarCitasPacientes.findByIdAndDelete(
        idSolicitud
      ).exec();
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send({
      respuesta: `Delete Solicitudes Anular/Cambiar Citas Pacientes: ${error.name} - ${error.message}`,
    });
  }
};

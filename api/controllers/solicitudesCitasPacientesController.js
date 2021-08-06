const SolicitudesAnularCambiarCitasPacientes = require("../models/SolicitudesAnularCambiarCitasPacientes");

exports.getSolicitudesAnularCambiarCitasPacientes = async (req, res) => {
  try {
    const solicitudesAnularCambiarCitasPacientes =
      await SolicitudesAnularCambiarCitasPacientes.find({
        'numeroPaciente.codigoEstablecimiento': req.params.codigoEstablecimiento,
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
    const { _id, correlativoSolicitud, respondida, motivo, detallesMotivo, enviadaHospital } =
      req.body;
    const modificacionesSolicitud = {
      correlativoSolicitud,
      motivo,
      detallesMotivo,
      respondida,
      enviadaHospital,
    };    
    await SolicitudesAnularCambiarCitasPacientes.updateOne(
        {_id: idSolicitud},
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
    await SolicitudesAnularCambiarCitasPacientes.deleteOne(
        {_id: idSolicitud}
      ).exec();
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send({
      respuesta: `Delete Solicitudes Anular/Cambiar Citas Pacientes: ${error.name} - ${error.message}`,
    });
  }
};

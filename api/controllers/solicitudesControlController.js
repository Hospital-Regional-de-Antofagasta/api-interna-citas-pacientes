const SolicitudesCambiarOAnularHorasMedicas = require("../models/SolicitudesCambiarOAnularHorasMedicas");

exports.getNuevasSolicitudesCambiarOAnularHorasMedicas = async (req, res) => {
  try {
    const tipoSolicitud = req.params.tipoSolicitud;
    const solicitudesCambiarOAnularHorasMedicas = await SolicitudesCambiarOAnularHorasMedicas.find({
      tipoSolicitud,
      enviadaHospital: false,
    })
      .sort({ createdAt: 1 })
      .limit(100)
      .exec();
    solicitudesCambiarOAnularHorasMedicas.forEach(async (solicitud) => {
      solicitud.enviadaHospital = true;
      await SolicitudesCambiarOAnularHorasMedicas.updateOne(
        { _id: solicitud._id },
        { enviadaHospital: true }
      ).exec();
    });
    res.status(200).send(solicitudesCambiarOAnularHorasMedicas);
  } catch (error) {
    res.status(500).send({
      respuesta: `Pacientes update: ${error.name} - ${error.message}`,
    });
  }
};

exports.updateEstadoSolicitudesCambiarOAnularHorasMedicas = async (req, res) => {
  try {
    const idSolicitud = req.params.idSolicitud;
    const { _id, correlativoSolicitud, correlativoCita, respondida } = req.body;
    const modificacionesSolicitud = {
      correlativoSolicitud,
      respondida,
    };
    // el correlativoCita es null para las solicitudes de tipo CAMBIAR Y ANULAR
    if (correlativoCita)
      modificacionesSolicitud.correlativoCita = correlativoCita;
    const solicitudActualizada = await SolicitudesCambiarOAnularHorasMedicas.findByIdAndUpdate(
      idSolicitud,
      modificacionesSolicitud
    ).exec();
    if (!solicitudActualizada)
      return res.status(404).send({ respuesta: "Solicitud no encontrada." });
    res.sendStatus(204);
  } catch (error) {
    console.log("error.name", error.name);
    console.log("error.message", error.message);
    res.status(500).send({
      respuesta: `Pacientes update: ${error.name} - ${error.message}`,
    });
  }
};

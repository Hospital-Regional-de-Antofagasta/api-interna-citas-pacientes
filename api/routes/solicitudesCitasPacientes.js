const express = require("express");
const solicitudesCitasPacientesController = require("../controllers/solicitudesCitasPacientesController");
const { isAuthenticated } = require("../middleware/auth");

const router = express.Router();

router.get(
  "/anular-cambiar/no-enviadas/",
  isAuthenticated,
  solicitudesCitasPacientesController.getSolicitudesAnularCambiarCitasPacientes
);

router.put(
  "/anular-cambiar/:idSolicitud",
  isAuthenticated,
  solicitudesCitasPacientesController.updateEstadoSolicitudesAnularCambiarCitasPacientes
);

router.delete(
  "/anular-cambiar/:idSolicitud",
  isAuthenticated,
  solicitudesCitasPacientesController.deleteSolicitudesAnularCambiarCitasPacientes
);

module.exports = router;

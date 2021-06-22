const express = require("express");
const solicitudesCitasPacientesController = require("../controllers/solicitudesCitasPacientesController");
const { isAuthenticated } = require("../middleware/auth");

const router = express.Router();

router.get(
  "/anular_cambiar/no_enviadas",
  isAuthenticated,
  solicitudesCitasPacientesController.getNuevasSolicitudesAnularCambiarCitasPacientes
);

router.put(
  "/anular_cambiar/:idSolicitud",
  isAuthenticated,
  solicitudesCitasPacientesController.updateEstadoSolicitudesAnularCambiarCitasPacientes
);

module.exports = router;

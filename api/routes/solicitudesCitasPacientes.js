const express = require("express");
const solicitudesCitasPacientesController = require("../controllers/solicitudesControlController");
const { isAuthenticated } = require("../middleware/auth");

const router = express.Router();

router.get(
  "/no_enviadas/:tipoSolicitud",
  isAuthenticated,
  solicitudesCitasPacientesController.getNuevasSolicitudesCambiarOAnularHorasMedicas
);

router.put(
  "/:idSolicitud",
  isAuthenticated,
  solicitudesCitasPacientesController.updateEstadoSolicitudesCambiarOAnularHorasMedicas
);

module.exports = router;

const express = require("express");
const citasPacientesSalidaController = require("../controllers/citasPacientesSalidaController");
const { isAuthenticated } = require("../middleware/auth");

const router = express.Router();

router.post("", isAuthenticated, citasPacientesSalidaController.create);

router.put("", isAuthenticated, citasPacientesSalidaController.updateMany);

router.delete("", isAuthenticated, citasPacientesSalidaController.deleteMany);

module.exports = router;

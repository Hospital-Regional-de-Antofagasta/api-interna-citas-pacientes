const express = require("express");
const citasPacientesController = require("../controllers/citasPacientesController");
const { isAuthenticated } = require("../middleware/auth");

const router = express.Router();

router.get("/ultimo/:codigoEstablecimiento", isAuthenticated, citasPacientesController.getLast);

router.post("/", isAuthenticated, citasPacientesController.create);

router.put(
  "/:correlativoCita/:codigoEstablecimiento",
  isAuthenticated,
  citasPacientesController.update
);

router.delete(
  "/:correlativoCita/:codigoEstablecimiento",
  isAuthenticated,
  citasPacientesController.delete
);

module.exports = router;

const express = require("express");
const citasPacientesController = require("../controllers/citasPacientesOldController");
const { isAuthenticated } = require("../middleware/authOld");

const router = express.Router();

router.get("/ultimo/", isAuthenticated, citasPacientesController.getLast);

router.post("", isAuthenticated, citasPacientesController.create);

router.put(
  "/:correlativoCita",
  isAuthenticated,
  citasPacientesController.update
);

router.delete(
  "/:correlativoCita",
  isAuthenticated,
  citasPacientesController.delete
);

module.exports = router;
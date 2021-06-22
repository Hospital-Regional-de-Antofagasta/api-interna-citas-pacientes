const express = require("express");
const citasPacientesController = require("../controllers/citasPacientesController");
const { isAuthenticated } = require("../middleware/auth");

const router = express.Router();

router.get("/ultimo", isAuthenticated, citasPacientesController.getLast);

router.post("/", isAuthenticated, citasPacientesController.create);

router.delete(
  "/:correlativoCita",
  isAuthenticated,
  citasPacientesController.delete
);


module.exports = router;

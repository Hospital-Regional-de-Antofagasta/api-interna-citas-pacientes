const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const citasPacientes = require("./routes/citasPacientes");
const solicitudesCitasPacientes = require("./routes/solicitudesCitasPacientes");

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use("/hradb-a-mongodb/citas-pacientes", citasPacientes);

app.use(
  "/hradb-a-mongodb/citas-pacientes/solicitudes",
  solicitudesCitasPacientes
);

module.exports = app;

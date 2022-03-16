const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const citasPacientesSalida = require("./routes/citasPacientesSalida");
const citasPacientes = require("./routes/citasPacientesOld");
const app = express();
app.use(express.json());
app.use(cors());

const connection = process.env.MONGO_URI;
const port = process.env.PORT;
const localhost = process.env.HOSTNAME;

mongoose.connect(connection, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/inter-mongo-citas-pacientes/health", (req, res) => {
  res.status(200).send("ready");
});

app.use("/inter-mongo-citas-pacientes/salida", citasPacientesSalida);

app.use("/hradb-a-mongodb/citas-pacientes", citasPacientes);

if (require.main === module) {
  // true if file is executed
  process.on("SIGINT", function () {
    process.exit();
  });
  app.listen(port, () => {
    console.log(`App listening at http://${localhost}:${port}`);
  });
}

module.exports = app;

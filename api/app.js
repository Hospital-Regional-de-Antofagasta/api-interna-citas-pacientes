const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const citasPacientes = require("./routes/citasPacientes");
const solicitudesCitasPacientes = require("./routes/solicitudesCitasPacientes");
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

app.use("/hradb-a-mongodb/citas-pacientes", citasPacientes);

app.use(
  "/hradb-a-mongodb/citas-pacientes/solicitudes",
  solicitudesCitasPacientes
);

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

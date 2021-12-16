const supertest = require("supertest");
const app = require("../api/app");
const mongoose = require("mongoose");
const CitasPacientes = require("../api/models/CitasPacientes");
const citasPacientesSeed = require("../tests/testSeeds/citasPacientesSeed.json");
const citasPacientesAInsertarSeed = require("../tests/testSeeds/citasPacientesAInsertarSeed.json");
const citasPacientesAActualizarSeed = require("../tests/testSeeds/citasPacientesAActualizarSeed.json");
const citasPacientesAEliminarSeed = require("../tests/testSeeds/citasPacientesAEliminarSeed.json");

const request = supertest(app);

const token = process.env.HRADB_A_MONGODB_SECRET;

const citaPacienteGuardar = {
  correlativo: 9,
  codigoLugar: "3000-4",
  nombreLugar: "nombreLugar 1",
  codigoServicio: "3000-4",
  nombreServicio: "nombreServicio 1",
  codigoProfesional: "14604071-3",
  nombreProfesional: "nombreProfesional 1",
  tipo: "C",
  codigoAmbito: "01",
  fechaCitacion: "2021-12-01",
  horaCitacion: "11:30",
  rutPaciente: "11111111-1",
  alta: null,
  bloqueadaEl: null,
  codigoEstablecimiento: "HRA",
  nombreEstablecimiento: "Hospital Regional Antofagasta Dr. Leonardo Guzmán",
};

const citaPacienteActualizar = {
  correlativo: 2,
  codigoLugar: "3000-41",
  nombreLugar: "nombreLugar 11",
  codigoServicio: "3000-41",
  nombreServicio: "nombreServicio 11",
  codigoProfesional: "14604071-31",
  nombreProfesional: "nombreProfesional 11",
  tipo: "N",
  codigoAmbito: "041",
  fechaCitacion: "2021-12-12",
  horaCitacion: "11:31",
  rutPaciente: "33333333-3",
  alta: true,
  bloqueadaEl: "2021-12-13",
  codigoEstablecimiento: "HRA",
  nombreEstablecimiento: "Hospital Regional Antofagasta Dr. Leonardo Guzmán1",
};

beforeEach(async () => {
  await mongoose.disconnect();
  await mongoose.connect(
    `${process.env.MONGO_URI}/citas_pacientes_salida_test`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
  await CitasPacientes.create(citasPacientesSeed);
});

afterEach(async () => {
  await CitasPacientes.deleteMany();
  await mongoose.disconnect();
});

describe("Endpoints citasPacientes salida", () => {
  describe("POST /inter-mongo-citas-pacientes/salida", () => {
    it("Should not save citaPaciente without token", async () => {
      const response = await request
        .post("/inter-mongo-citas-pacientes/salida")
        .send(citaPacienteGuardar);

      expect(response.status).toBe(401);

      expect(response.body.error).toBe("Acceso no autorizado.");

      const citaPacienteDespues = await CitasPacientes.findOne({
        $and: [
          { correlativo: citaPacienteGuardar.correlativo },
          { codigoEstablecimiento: citaPacienteGuardar.codigoEstablecimiento },
        ],
      });

      expect(citaPacienteDespues).toBeFalsy();
    });
    it("Should not save citaPaciente with invalid token", async () => {
      const response = await request
        .post("/inter-mongo-citas-pacientes/salida")
        .set("Authorization", "no-token")
        .send(citaPacienteGuardar);

      expect(response.status).toBe(401);

      expect(response.body.error).toBe("Acceso no autorizado.");

      const citaPacienteDespues = await CitasPacientes.findOne({
        $and: [
          { correlativo: citaPacienteGuardar.correlativo },
          { codigoEstablecimiento: citaPacienteGuardar.codigoEstablecimiento },
        ],
      });

      expect(citaPacienteDespues).toBeFalsy();
    });
    it("Should save citaPaciente", async () => {
      const response = await request
        .post("/inter-mongo-citas-pacientes/salida")
        .set("Authorization", token)
        .send([citaPacienteGuardar]);

      expect(response.status).toBe(201);

      const citaPacienteDespues = await CitasPacientes.findOne({
        $and: [
          { correlativo: citaPacienteGuardar.correlativo },
          { codigoEstablecimiento: citaPacienteGuardar.codigoEstablecimiento },
        ],
      }).exec();

      expect(citaPacienteDespues).toBeTruthy();
      expect(citaPacienteDespues.correlativo).toBe(
        citaPacienteGuardar.correlativo
      );
      expect(citaPacienteDespues.codigoLugar).toBe(
        citaPacienteGuardar.codigoLugar
      );
      expect(citaPacienteDespues.nombreLugar).toBe(
        citaPacienteGuardar.nombreLugar
      );
      expect(citaPacienteDespues.codigoServicio).toBe(
        citaPacienteGuardar.codigoServicio
      );
      expect(citaPacienteDespues.nombreServicio).toBe(
        citaPacienteGuardar.nombreServicio
      );
      expect(citaPacienteDespues.codigoProfesional).toBe(
        citaPacienteGuardar.codigoProfesional
      );
      expect(citaPacienteDespues.nombreProfesional).toBe(
        citaPacienteGuardar.nombreProfesional
      );
      expect(citaPacienteDespues.tipo).toBe(citaPacienteGuardar.tipo);
      expect(citaPacienteDespues.codigoAmbito).toBe(
        citaPacienteGuardar.codigoAmbito
      );
      expect(Date.parse(citaPacienteDespues.fechaCitacion)).toBe(
        Date.parse(citaPacienteGuardar.fechaCitacion)
      );
      expect(citaPacienteDespues.horaCitacion).toBe(
        citaPacienteGuardar.horaCitacion
      );
      expect(citaPacienteDespues.rutPaciente).toBe(
        citaPacienteGuardar.rutPaciente
      );
      expect(citaPacienteDespues.alta).toBe(citaPacienteGuardar.alta);
      expect(Date.parse(citaPacienteDespues.bloqueadaEl)).toBe(
        Date.parse(citaPacienteGuardar.bloqueadaEl)
      );
      expect(citaPacienteDespues.codigoEstablecimiento).toBe(
        citaPacienteGuardar.codigoEstablecimiento
      );
      expect(citaPacienteDespues.nombreEstablecimiento).toBe(
        citaPacienteGuardar.nombreEstablecimiento
      );
    });
    it("Should save multiple citasPacientes and return errors", async () => {
      const response = await request
        .post("/inter-mongo-citas-pacientes/salida")
        .set("Authorization", token)
        .send(citasPacientesAInsertarSeed);

      expect(response.status).toBe(201);

      const citasPacientesBD = await CitasPacientes.find().exec();

      expect(citasPacientesBD.length).toBe(8);

      const { respuesta } = response.body;

      console.log(respuesta)

      expect(respuesta.length).toBe(7);
      expect(respuesta).toEqual([
        {
          afectado: 1,
          realizado: true,
          error: "La cita del paciente ya existe.",
        },
        {
          afectado: 13,
          realizado: true,
          error: "",
        },
        {
          afectado: 2,
          realizado: true,
          error: "La cita del paciente ya existe.",
        },
        {
          afectado: 14,
          realizado: true,
          error: "",
        },
        {
          afectado: 16,
          realizado: false,
          error: "MongoServerError - E11000 duplicate key error collection: citas_pacientes_salida_test.citas_pacientes index: _id_ dup key: { _id: ObjectId('303030303030303030303031') }",
        },
        {
          afectado: 15,
          realizado: true,
          error: "",
        },
        {
          afectado: 4,
          realizado: true,
          error: "La cita del paciente ya existe.",
        },
      ]);
    });
  });
  describe("PUT /inter-mongo-citas-pacientes/salida", () => {
    it("Should not update citaPaciente without token", async () => {
      const citaPacienteAntes = await CitasPacientes.findOne({
        $and: [
          { correlativo: citaPacienteActualizar.correlativo },
          {
            codigoEstablecimiento: citaPacienteActualizar.codigoEstablecimiento,
          },
        ],
      }).exec();

      const response = await request
        .put("/inter-mongo-citas-pacientes/salida")
        .send(citaPacienteActualizar);

      expect(response.status).toBe(401);

      expect(response.body.error).toBe("Acceso no autorizado.");

      const citaPacienteDespues = await CitasPacientes.findOne({
        $and: [
          { correlativo: citaPacienteActualizar.correlativo },
          {
            codigoEstablecimiento: citaPacienteActualizar.codigoEstablecimiento,
          },
        ],
      }).exec();

      expect(citaPacienteAntes).toEqual(citaPacienteDespues);
    });
    it("Should not update citaPaciente with invalid token", async () => {
      const citaPacienteAntes = await CitasPacientes.findOne({
        $and: [
          { correlativo: citaPacienteActualizar.correlativo },
          {
            codigoEstablecimiento: citaPacienteActualizar.codigoEstablecimiento,
          },
        ],
      }).exec();

      const response = await request
        .put("/inter-mongo-citas-pacientes/salida")
        .set("Authorization", "no-token")
        .send(citaPacienteActualizar);

      expect(response.status).toBe(401);

      expect(response.body.error).toBe("Acceso no autorizado.");

      const citaPacienteDespues = await CitasPacientes.findOne({
        $and: [
          { correlativo: citaPacienteActualizar.correlativo },
          {
            codigoEstablecimiento: citaPacienteActualizar.codigoEstablecimiento,
          },
        ],
      }).exec();

      expect(citaPacienteAntes).toEqual(citaPacienteDespues);
    });
    it("Should update citaPaciente", async () => {
      const response = await request
        .put("/inter-mongo-citas-pacientes/salida")
        .set("Authorization", token)
        .send([citaPacienteActualizar]);

      expect(response.status).toBe(200);

      const citaPacienteDespues = await CitasPacientes.findOne({
        $and: [
          { correlativo: citaPacienteActualizar.correlativo },
          {
            codigoEstablecimiento: citaPacienteActualizar.codigoEstablecimiento,
          },
        ],
      }).exec();

      expect(citaPacienteDespues.correlativo).toBe(
        citaPacienteActualizar.correlativo
      );
      expect(citaPacienteDespues.codigoLugar).toBe(
        citaPacienteActualizar.codigoLugar
      );
      expect(citaPacienteDespues.nombreLugar).toBe(
        citaPacienteActualizar.nombreLugar
      );
      expect(citaPacienteDespues.codigoServicio).toBe(
        citaPacienteActualizar.codigoServicio
      );
      expect(citaPacienteDespues.nombreServicio).toBe(
        citaPacienteActualizar.nombreServicio
      );
      expect(citaPacienteDespues.codigoProfesional).toBe(
        citaPacienteActualizar.codigoProfesional
      );
      expect(citaPacienteDespues.nombreProfesional).toBe(
        citaPacienteActualizar.nombreProfesional
      );
      expect(citaPacienteDespues.tipo).toBe(citaPacienteActualizar.tipo);
      expect(citaPacienteDespues.codigoAmbito).toBe(
        citaPacienteActualizar.codigoAmbito
      );
      expect(Date.parse(citaPacienteDespues.fechaCitacion)).toBe(
        Date.parse(citaPacienteActualizar.fechaCitacion)
      );
      expect(citaPacienteDespues.horaCitacion).toBe(
        citaPacienteActualizar.horaCitacion
      );
      expect(citaPacienteDespues.rutPaciente).toBe(
        citaPacienteActualizar.rutPaciente
      );
      expect(citaPacienteDespues.alta).toBe(citaPacienteActualizar.alta);
      expect(Date.parse(citaPacienteDespues.bloqueadaEl)).toBe(
        Date.parse(citaPacienteActualizar.bloqueadaEl)
      );
      expect(citaPacienteDespues.codigoEstablecimiento).toBe(
        citaPacienteActualizar.codigoEstablecimiento
      );
      expect(citaPacienteDespues.nombreEstablecimiento).toBe(
        citaPacienteActualizar.nombreEstablecimiento
      );
    });
    it("Should update multiple citasPacientes and return errors", async () => {
      const response = await request
        .put("/inter-mongo-citas-pacientes/salida")
        .set("Authorization", token)
        .send(citasPacientesAActualizarSeed);

      expect(response.status).toBe(200);

      const { respuesta } = response.body;

      expect(respuesta.length).toBe(4);

      expect(respuesta).toEqual([
        {
          afectado: 10,
          realizado: false,
          error: "La cita del paciente no existe.",
        },
        {
          afectado: 2,
          realizado: true,
          error: "",
        },
        {
          afectado: 3,
          realizado: false,
          error:
            "MongoServerError - Performing an update on the path '_id' would modify the immutable field '_id'",
        },
        {
          afectado: 3,
          realizado: true,
          error: "",
        },
      ]);
    });
  });
  describe("DELETE /inter-mongo-citas-pacientes/salida", () => {
    it("Should not delete citaPaciente without token", async () => {
      const citaPacienteAntes = await CitasPacientes.findOne({
        $and: [
          { correlativo: 1 },
          {
            codigoEstablecimiento: "HRA",
          },
        ],
      }).exec();

      const response = await request
        .delete("/inter-mongo-citas-pacientes/salida")
        .send([{ correlativo: 1, codigoEstablecimiento: "HRA" }]);

      expect(response.status).toBe(401);

      expect(response.body.error).toBe("Acceso no autorizado.");

      const citaPacienteDespues = await CitasPacientes.findOne({
        $and: [
          { correlativo: 1 },
          {
            codigoEstablecimiento: "HRA",
          },
        ],
      }).exec();

      expect(citaPacienteAntes).toEqual(citaPacienteDespues);
    });
    it("Should not delete citaPaciente with invalid token", async () => {
      const citaPacienteAntes = await CitasPacientes.findOne({
        $and: [
          { correlativo: 1 },
          {
            codigoEstablecimiento: "HRA",
          },
        ],
      }).exec();

      const response = await request
        .delete("/inter-mongo-citas-pacientes/salida")
        .set("Authorization", "no-token")
        .send([{ correlativo: 1, codigoEstablecimiento: "HRA" }]);

      expect(response.status).toBe(401);

      expect(response.body.error).toBe("Acceso no autorizado.");

      const citaPacienteDespues = await CitasPacientes.findOne({
        $and: [
          { correlativo: 1 },
          {
            codigoEstablecimiento: "HRA",
          },
        ],
      }).exec();

      expect(citaPacienteAntes).toEqual(citaPacienteDespues);
    });
    it("Should delete citaPaciente", async () => {
      const response = await request
        .delete("/inter-mongo-citas-pacientes/salida")
        .set("Authorization", token)
        .send([{ correlativo: 1, codigoEstablecimiento: "HRA" }]);

      const citaPacienteDespues = await CitasPacientes.findOne({
        $and: [
          { correlativo: 1 },
          {
            codigoEstablecimiento: "HRA",
          },
        ],
      }).exec();

      expect(response.status).toBe(200);
      expect(citaPacienteDespues).toBeFalsy();
    });
    it("Should delete multiple citasPacientes and return errors", async () => {
      const response = await request
        .delete("/inter-mongo-citas-pacientes/salida")
        .set("Authorization", token)
        .send(citasPacientesAEliminarSeed);

      expect(response.status).toBe(200);

      const citasPacientesBD = await CitasPacientes.find().exec();

      expect(citasPacientesBD.length).toBe(3);

      const { respuesta } = response.body;

      expect(respuesta.length).toBe(4);
      expect(respuesta).toEqual([
        {
          afectado: 14,
          realizado: true,
          error: "La cita del paciente no existe.",
        },
        {
          afectado: 1,
          realizado: true,
          error: "",
        },
        {
          afectado: 15,
          realizado: true,
          error: "La cita del paciente no existe.",
        },
        {
          afectado: 3,
          realizado: true,
          error: "",
        },
      ]);
    });
  });
});

const supertest = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const CitasPacientes = require("../models/CitasPacientes");
const citasPacientesSeeds = require("../testSeeds/citaspacientesSeed.json");

const request = supertest(app);

const token = process.env.HRADB_A_MONGODB_SECRET;

beforeEach(async () => {
  await mongoose.disconnect();
  await mongoose.connect(`${process.env.MONGO_URI_TEST}citas_pacientes_test`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await CitasPacientes.create(citasPacientesSeeds);
});

afterEach(async () => {
  await CitasPacientes.deleteMany();
  await mongoose.disconnect();
});

const citaPacienteGuardar = {
  correlativoCita: 11,
  nombreLugar: "nombreLugar",
  nombreServicio: "nombreServicio",
  nombreProfesional: "nombreProfesional",
  fechaCitacion: "2021-10-30",
  horaCitacion: "10:30",
  numeroPaciente: 
      {
        numero: 16,
        codigoEstablecimiento: "E01",
        hospital: {
          E01: 1
        },
        nombreEstablecimiento: "Hospital Regional de Antofagasta"
      },
  codigoAmbito: "01",
};

describe("Endpoints citas pacientes", () => {
  describe("GET /hradb-a-mongodb/citas-pacientes/ultimo/:codigoEstablecimiento", () => {
    it("Should not get last cita paciente", async (done) => {
      const response = await request
        .get("/hradb-a-mongodb/citas-pacientes/ultimo/E01")
        .set("Authorization", "no-token");
      expect(response.status).toBe(401);

      done();
    });
    it("Should get last cita paciente from empty database", async (done) => {
      await CitasPacientes.deleteMany();
      const response = await request
        .get("/hradb-a-mongodb/citas-pacientes/ultimo/E01")
        .set("Authorization", token);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({});

      done();
    });
    it("Should get last cita paciente from database", async (done) => {
      await CitasPacientes.create(citaPacienteGuardar);
      const response = await request
        .get("/hradb-a-mongodb/citas-pacientes/ultimo/E01")
        .set("Authorization", token);
      expect(response.status).toBe(200);
      expect(response.body.correlativoCita).toBe(
        citaPacienteGuardar.correlativoCita
      );
      expect(response.body.nombreLugar).toBe(citaPacienteGuardar.nombreLugar);
      expect(response.body.nombreServicio).toBe(
        citaPacienteGuardar.nombreServicio
      );
      expect(response.body.nombreProfesional).toBe(
        citaPacienteGuardar.nombreProfesional
      );
      expect(Date.parse(response.body.fechaCitacion)).toBe(
        Date.parse(citaPacienteGuardar.fechaCitacion)
      );
      expect(response.body.horaCitacion).toBe(citaPacienteGuardar.horaCitacion);
      expect(response.body.numeroPaciente.numero).toBe(
        citaPacienteGuardar.numeroPaciente.numero
      );
      expect(response.body.numeroPaciente.codigoEstablecimiento).toBe(
        citaPacienteGuardar.numeroPaciente.codigoEstablecimiento
      );
      expect(response.body.numeroPaciente.nombreEstablecimiento).toBe(
        citaPacienteGuardar.numeroPaciente.nombreEstablecimiento
      );
      expect(response.body.codigoAmbito).toBe(citaPacienteGuardar.codigoAmbito);

      done();
    });
  });
  describe("POST /hradb-a-mongodb/citas-pacientes", () => {
    it("Should not save cita paciente to database", async (done) => {
      const response = await request
        .post("/hradb-a-mongodb/citas-pacientes")
        .set("Authorization", "no-token")
        .send(citaPacienteGuardar);
      const citaPacienteObtenida = await CitasPacientes.findOne({
        correlativoCita: citaPacienteGuardar.correlativoCita,
      });
      expect(response.status).toBe(401);
      expect(citaPacienteObtenida).toBeFalsy();

      done();
    });
    it("Should save cita paciente to database", async (done) => {
      const response = await request
        .post("/hradb-a-mongodb/citas-pacientes")
        .set("Authorization", token)
        .send(citaPacienteGuardar);
      const citaPacienteObtenida = await CitasPacientes.findOne({
        correlativoCita: citaPacienteGuardar.correlativoCita,
      });
      expect(response.status).toBe(201);
      expect(citaPacienteObtenida.correlativoCita).toBe(
        citaPacienteGuardar.correlativoCita
      );
      expect(citaPacienteObtenida.nombreLugar).toBe(
        citaPacienteGuardar.nombreLugar
      );
      expect(citaPacienteObtenida.nombreServicio).toBe(
        citaPacienteGuardar.nombreServicio
      );
      expect(citaPacienteObtenida.nombreProfesional).toBe(
        citaPacienteGuardar.nombreProfesional
      );
      expect(Date.parse(citaPacienteObtenida.fechaCitacion)).toBe(
        Date.parse(citaPacienteGuardar.fechaCitacion)
      );
      expect(citaPacienteObtenida.horaCitacion).toBe(
        citaPacienteGuardar.horaCitacion
      );
      expect(citaPacienteObtenida.numeroPaciente.numero).toBe(
        citaPacienteGuardar.numeroPaciente.numero
      );
      expect(citaPacienteObtenida.numeroPaciente.codigoEstablecimiento).toBe(
        citaPacienteGuardar.numeroPaciente.codigoEstablecimiento
      );
      expect(citaPacienteObtenida.numeroPaciente.nombreEstablecimiento).toBe(
        citaPacienteGuardar.numeroPaciente.nombreEstablecimiento
      );
      expect(citaPacienteObtenida.codigoAmbito).toBe(
        citaPacienteGuardar.codigoAmbito
      );

      done();
    });
  });
  describe("PUT /hradb-a-mongodb/citas-pacientes/:codigoEstablecimiento/:correlativoCita", () => {
    it("Should not update cita paciente from database", async (done) => {
      await CitasPacientes.create(citaPacienteGuardar);
      const response = await request
        .put(
          `/hradb-a-mongodb/citas-pacientes/${citaPacienteGuardar.numeroPaciente.codigoEstablecimiento}/${citaPacienteGuardar.correlativoCita}`
        )
        .set("Authorization", "no-token");
      const citaPacienteObtenida = await CitasPacientes.findOne({
        correlativoCita: citaPacienteGuardar.correlativoCita,
      });
      expect(response.status).toBe(401);
      expect(citaPacienteObtenida).toBeTruthy();

      done();
    });
    it("Should update cita paciente from database", async (done) => {
      await CitasPacientes.create(citaPacienteGuardar);
      const response = await request
        .put(
          `/hradb-a-mongodb/citas-pacientes/${citaPacienteGuardar.numeroPaciente.codigoEstablecimiento}/${citaPacienteGuardar.correlativoCita}`
        )
        .set("Authorization", token)
        .send({
          nombreLugar: "nombreLugarNuevo",
          nombreServicio: "nombreServicio",
          nombreProfesional: "nombreProfesional",
          fechaCitacion: "2021-10-28",
          horaCitacion: "10:30",
          codigoServicio: "001",
          codigoProfesional: "11111111-1",
          blockedAt: null,
          alta: true,
        });
      const citaPacienteObtenida = await CitasPacientes.findOne({
        correlativoCita: citaPacienteGuardar.correlativoCita,
      });
      expect(response.status).toBe(204);
      expect(citaPacienteObtenida.nombreLugar).toBe("nombreLugarNuevo");
      expect(Date(citaPacienteObtenida.fechaCitacion)).toBe(
        Date("2021-10-28T00:00:00.000Z")
      );
      expect(citaPacienteObtenida.alta).toBe(true);

      done();
    });
    it("Should not fail if cita paciente does not exists", async (done) => {
      const response = await request
        .put(`/hradb-a-mongodb/citas-pacientes/${citaPacienteGuardar.numeroPaciente.codigoEstablecimiento}/0`)
        .set("Authorization", token)
        .send({
          nombreLugar: "nombreLugarNuevo",
          nombreServicio: "nombreServicio",
          nombreProfesional: "nombreProfesional",
          fechaCitacion: "2021-10-28T00:00:00.000Z",
          horaCitacion: "10:30",
          codigoServicio: "001",
          codigoProfesional: "11111111-1",
          blockedAt: null,
          alta: true,
        });
      const citaPacienteObtenida = await CitasPacientes.findOne({
        correlativoCita: 0,
        'numeroPaciente.codigoEstablecimiento': citaPacienteGuardar.numeroPaciente.codigoEstablecimiento
      });
      expect(response.status).toBe(204);
      expect(citaPacienteObtenida).toBeFalsy();
      done();
    });
  });
  describe("DELETE /hradb-a-mongodb/citas-pacientes/:codigoEstablecimiento/:correlativoCita", () => {
    it("Should not delete cita paciente from database", async (done) => {
      await CitasPacientes.create(citaPacienteGuardar);
      const response = await request
        .delete(
          `/hradb-a-mongodb/citas-pacientes/${citaPacienteGuardar.numeroPaciente.codigoEstablecimiento}/${citaPacienteGuardar.correlativoCita}`
        )
        .set("Authorization", "no-token");
      const citaPacienteObtenida = await CitasPacientes.findOne({
        correlativoCita: citaPacienteGuardar.correlativoCita,
        'numeroPaciente.codigoEstablecimiento': citaPacienteGuardar.numeroPaciente.codigoEstablecimiento
      });
      expect(response.status).toBe(401);
      expect(citaPacienteObtenida).toBeTruthy();

      done();
    });
    it("Should delete cita paciente from database", async (done) => {
      await CitasPacientes.create(citaPacienteGuardar);
      const response = await request
        .delete(
          `/hradb-a-mongodb/citas-pacientes/${citaPacienteGuardar.numeroPaciente.codigoEstablecimiento}/${citaPacienteGuardar.correlativoCita}`
        )
        .set("Authorization", token);
      const citaPacienteObtenida = await CitasPacientes.findOne({
        correlativoCita: citaPacienteGuardar.correlativoCita,
        'numeroPaciente.codigoEstablecimiento': citaPacienteGuardar.numeroPaciente.codigoEstablecimiento
      });
      expect(response.status).toBe(204);
      expect(citaPacienteObtenida).toBeFalsy();

      done();
    });
    it("Should not fail if cita paciente does not exists", async (done) => {
      const response = await request
        .delete(
          `/hradb-a-mongodb/citas-pacientes/${citaPacienteGuardar.numeroPaciente.codigoEstablecimiento}/${citaPacienteGuardar.correlativoCita}`
        )
        .set("Authorization", token);
      expect(response.status).toBe(204);

      done();
    });
  });
});

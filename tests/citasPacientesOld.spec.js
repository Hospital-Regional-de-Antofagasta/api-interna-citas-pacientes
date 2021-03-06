const supertest = require("supertest");
const app = require("../api/app");
const mongoose = require("mongoose");
const CitasPacientes = require("../api/models/CitasPacientesOld");
const citasPacientesSeeds = require("../tests/testSeeds/citasPacientesOldSeed.json");

const request = supertest(app);

const token = process.env.HRADB_A_MONGODB_SECRET;

beforeEach(async () => {
  // await mongoose.disconnect();
  // await mongoose.connect(`${process.env.MONGO_URI}/citas_pacientes_old_test`, {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  // });
  await CitasPacientes.create(citasPacientesSeeds);
});

afterEach(async () => {
  await CitasPacientes.deleteMany();
  // await mongoose.disconnect();
});

afterAll(async () => {
  await mongoose.disconnect();
});

const citaPacienteGuardar = {
  correlativoCita: 11,
  nombreLugar: "nombreLugar",
  nombreServicio: "nombreServicio",
  nombreProfesional: "nombreProfesional",
  fechaCitacion: "2021-10-30",
  horaCitacion: "10:30",
  numeroPaciente:16,
  codigoAmbito: "01",
};

describe("Endpoints citas pacientes", () => {
  describe("GET /hradb-a-mongodb/citas-pacientes/ultimo/", () => {
    it("Should not get last cita paciente", async (done) => {
      const response = await request
        .get("/hradb-a-mongodb/citas-pacientes/ultimo/")
        .set("Authorization", "no-token");
      expect(response.status).toBe(401);

      done();
    });
    it("Should get last cita paciente from empty database", async (done) => {
      await CitasPacientes.deleteMany();
      const response = await request
        .get("/hradb-a-mongodb/citas-pacientes/ultimo/")
        .set("Authorization", token);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({});

      done();
    });
    it("Should get last cita paciente from database", async (done) => {
      await CitasPacientes.create(citaPacienteGuardar);
      const response = await request
        .get("/hradb-a-mongodb/citas-pacientes/ultimo/")
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
      expect(response.body.numeroPaciente).toBe(
        citaPacienteGuardar.numeroPaciente
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
      delete citaPacienteGuardar.numeroPaciente.hospital
      const response = await request
        .post("/hradb-a-mongodb/citas-pacientes")
        .set("Authorization", token)
        .send(citaPacienteGuardar);
      const citaPacienteObtenida = await CitasPacientes.findOne({
        correlativoCita: citaPacienteGuardar.correlativoCita,
      })
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
      expect(citaPacienteObtenida.numeroPaciente).toBe(
        citaPacienteGuardar.numeroPaciente
      );      
      expect(citaPacienteObtenida.codigoAmbito).toBe(
        citaPacienteGuardar.codigoAmbito
      );
      done();
    });
  });
  describe("PUT /hradb-a-mongodb/citas-pacientes/:correlativoCita", () => {
    it("Should not update cita paciente from database", async (done) => {
      await CitasPacientes.create(citaPacienteGuardar);
      const response = await request
        .put(
          `/hradb-a-mongodb/citas-pacientes/${citaPacienteGuardar.correlativoCita}`
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
          `/hradb-a-mongodb/citas-pacientes/${citaPacienteGuardar.correlativoCita}`
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
        .put(`/hradb-a-mongodb/citas-pacientes/0`)
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
      });
      expect(response.status).toBe(204);
      expect(citaPacienteObtenida).toBeFalsy();
      done();
    });
  });
  describe("DELETE /hradb-a-mongodb/citas-pacientes/:correlativoCita", () => {
    it("Should not delete cita paciente from database", async (done) => {
      await CitasPacientes.create(citaPacienteGuardar);
      const response = await request
        .delete(
          `/hradb-a-mongodb/citas-pacientes/${citaPacienteGuardar.correlativoCita}`
        )
        .set("Authorization", "no-token");
      const citaPacienteObtenida = await CitasPacientes.findOne({
        correlativoCita: citaPacienteGuardar.correlativoCita,
      });
      expect(response.status).toBe(401);
      expect(citaPacienteObtenida).toBeTruthy();

      done();
    });
    it("Should delete cita paciente from database", async (done) => {
      await CitasPacientes.create(citaPacienteGuardar);
      const response = await request
        .delete(
          `/hradb-a-mongodb/citas-pacientes/${citaPacienteGuardar.correlativoCita}`
        )
        .set("Authorization", token);
      const citaPacienteObtenida = await CitasPacientes.findOne({
        correlativoCita: citaPacienteGuardar.correlativoCita,
      });
      expect(response.status).toBe(204);
      expect(citaPacienteObtenida).toBeFalsy();

      done();
    });
    it("Should not fail if cita paciente does not exists", async (done) => {
      const response = await request
        .delete(
          `/hradb-a-mongodb/citas-pacientes/${citaPacienteGuardar.correlativoCita}`
        )
        .set("Authorization", token);
      expect(response.status).toBe(204);

      done();
    });
  });
});
const supertest = require("supertest");
const app = require("../api/index");
const mongoose = require("mongoose");
const SolicitudesAnularCambiarCitasPacientes = require("../api/models/SolicitudesAnularCambiarCitasPacientes");
const SolicitudesAnularCambiarCitasPacientesSeed = require("../api/testSeeds/solicitudesAnularCambiarCitasPacientes.json");
const cienSolicitudesAnularCambiarCitasPacientesSeed = require("../api/testSeeds/cienSolicitudesAnularCambiarCitasPacientesSeed.json");

const request = supertest(app);

const token = process.env.HRADB_A_MONGODB_SECRET;

beforeEach(async () => {
  await mongoose.disconnect();
  await mongoose.connect(
    `${process.env.MONGO_URI_TEST}solicitudes_citas_pacientes_test`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
  await SolicitudesAnularCambiarCitasPacientes.create(
    SolicitudesAnularCambiarCitasPacientesSeed
  );
});

afterEach(async () => {
  await SolicitudesAnularCambiarCitasPacientes.deleteMany();
  await mongoose.disconnect();
});

describe("Enpoints solicitudes de anular/cambiar citas pacientes", () => {
  describe("GET /hradb-a-mongodb/citas-pacientes/solicitudes/anular-cambiar/no-enviadas/", () => {
    it("Should not get solicitudes de anular/cambiar citas pacientes no enviadas", async (done) => {
      const response = await request
        .get(
          "/hradb-a-mongodb/citas-pacientes/solicitudes/anular-cambiar/no-enviadas/"
        )
        .set("Authorization", "no-token");

      expect(response.status).toBe(401);
      expect(response.body.respuesta).toBe("Acceso no autorizado.");

      done();
    });
    it("Should get 0 solicitudes de anular/cambiar citas pacientes no enviadas from empty database", async (done) => {
      await SolicitudesAnularCambiarCitasPacientes.deleteMany();
      const response = await request
        .get(
          "/hradb-a-mongodb/citas-pacientes/solicitudes/anular-cambiar/no-enviadas"
        )
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);

      done();
    });
    it("Should get solicitudes de anular/cambiar citas pacientes no enviadas", async (done) => {
      const response = await request
        .get(
          "/hradb-a-mongodb/citas-pacientes/solicitudes/anular-cambiar/no-enviadas"
        )
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);

      done();
    });
    it("Should get only 100 solicitudes de anular/cambiar citas pacientes no enviadas", async (done) => {
      await SolicitudesAnularCambiarCitasPacientes.deleteMany();
      await SolicitudesAnularCambiarCitasPacientes.create(
        cienSolicitudesAnularCambiarCitasPacientesSeed
      );
      const response = await request
        .get(
          "/hradb-a-mongodb/citas-pacientes/solicitudes/anular-cambiar/no-enviadas"
        )
        .set("Authorization", token);

     

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(100);

      done();
    });
  });
  describe("PUT /hradb-a-mongodb/citas-pacientes/solicitudes/anular-cambiar/:idSolicitud", () => {
    it("Should not update estado solicitudes de anular/cambiar citas pacientes", async (done) => {
      const newSolicitudControl =
        await SolicitudesAnularCambiarCitasPacientes.create({
          correlativoSolicitud: null,
          numeroPaciente: 123,
          correlativoCita: null,
          tipoSolicitud: "ANULAR",
          respondida: false,
        });

      const response = await request
        .put(
          `/hradb-a-mongodb/citas-pacientes/solicitudes/anular-cambiar/${newSolicitudControl._id}`
        )
        .set("Authorization", "no-token")
        .send({
          correlativoSolicitud: 789,
          correlativoCita: 456,
          respondida: true,
        });

      expect(response.status).toBe(401);
      expect(response.body.respuesta).toBe("Acceso no autorizado.");

      done();
    });
    it("Should update estado of non existing solicitudes de anular/cambiar citas pacientes", async (done) => {
      const response = await request
        .put(
          `/hradb-a-mongodb/citas-pacientes/solicitudes/anular-cambiar/60a26ce906ec5a89b4fd6240`
        )
        .set("Authorization", token)
        .send({
          correlativoSolicitud: 789,
          correlativoCita: 456,
          respondida: true,
        });

      expect(response.status).toBe(204);      
      expect(response.body).toEqual({});

      done();
    });
    it("Should update estado solicitudes de anular/cambiar citas pacientes as respondida", async (done) => {
      const newSolicitudControl =
        await SolicitudesAnularCambiarCitasPacientes.create({
          correlativoSolicitud: null,
          numeroPaciente: 123,
          correlativoCita: 456,
          tipoSolicitud: "ANULAR",
          respondida: false,
        });

      const response = await request
        .put(
          `/hradb-a-mongodb/citas-pacientes/solicitudes/anular-cambiar/${newSolicitudControl._id}`
        )
        .set("Authorization", token)
        .send({
          correlativoSolicitud: 789,
          correlativoCita: 456,
          respondida: true,
        });

      const solicitudControlActualizada =
        await SolicitudesAnularCambiarCitasPacientes.findById(
          newSolicitudControl._id
        );

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});

      expect(solicitudControlActualizada.correlativoSolicitud).toBe(789);
      expect(solicitudControlActualizada.correlativoCita).toBe(456);
      expect(solicitudControlActualizada.respondida).toBeTruthy();

      done();
    });
  });
  describe("DELETE /hradb-a-mongodb/citas-pacientes/solicitudes/anular-cambiar/:idSolicitud", () => {
    it("Should delete non existing solicitudes de anular/cambiar citas pacientes", async (done) => {
      const response = await request
        .delete(
          `/hradb-a-mongodb/citas-pacientes/solicitudes/anular-cambiar/60a26ce906ec5a89b4fd6240`
        )
        .set("Authorization", token)
        .send({
          correlativoSolicitud: 789,
          correlativoCita: 456,
          respondida: true,
        });

      expect(response.status).toBe(204);      
      expect(response.body).toEqual({});
      done();
    });
    it("Should delete solicitudes de anular/cambiar citas pacientes", async (done) => {
      const newSolicitudControl =
        await SolicitudesAnularCambiarCitasPacientes.create({
          correlativoSolicitud: null,
          numeroPaciente: 123,
          correlativoCita: 456,
          tipoSolicitud: "ANULAR",
          respondida: false,
        });

      const response = await request
        .delete(
          `/hradb-a-mongodb/citas-pacientes/solicitudes/anular-cambiar/${newSolicitudControl._id}`
        )
        .set("Authorization", token);

      const solicitudControlEliminada =
        await SolicitudesAnularCambiarCitasPacientes.findById(
          newSolicitudControl._id
        );

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});

      expect(solicitudControlEliminada).toBeFalsy();

      done();
    });
  });
});

const supertest = require("supertest");
const app = require("../api/index");
const mongoose = require("mongoose");
const SolicitudesCambiarOAnularHorasMedicas = require("../api/models/SolicitudesCambiarOAnularHorasMedicas");
const solicitudesCambiarOAnularHorasMedicasSeed = require("../api/testSeeds/solicitudesCambiarOAnularHorasMedicas.json");
const cienSolicitudesCambiarOAnularHorasMedicasSeed = require("../api/testSeeds/cienSolicitudesCambiarOAnularHorasMedicasSeed.json");

const request = supertest(app);

const token = process.env.HRADB_A_MONGODB_SECRET;

beforeEach(async () => {
  await mongoose.disconnect();
  await mongoose.connect(
    `${process.env.MONGO_URI_TEST}solicitudes_control_test`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
  await SolicitudesCambiarOAnularHorasMedicas.create(solicitudesCambiarOAnularHorasMedicasSeed);
});

afterEach(async () => {
  await SolicitudesCambiarOAnularHorasMedicas.deleteMany();
  await mongoose.disconnect();
});

describe("Enpoints solicitudes de control no enviadas", () => {
  describe("Get solicitudes de control no enviadas por tipo", () => {
    it("Should not get solicitudes de control no enviadas", async (done) => {
      const response = await request
        .get("/hra/hradb_a_mongodb/solicitudes_control/no_enviadas/AGENDAR")
        .set("Authorization", "no-token");

      expect(response.status).toBe(401);
      expect(response.body.respuesta).toBe("Acceso no autorizado.");

      done();
    });
    it("Should get 0 solicitudes de control no enviadas from empty database", async (done) => {
      await SolicitudesCambiarOAnularHorasMedicas.deleteMany();
      const response = await request
        .get("/hra/hradb_a_mongodb/solicitudes_control/no_enviadas/ANULAR")
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);

      done();
    });
    it("Should get solicitudes de control no enviadas", async (done) => {
      const response = await request
        .get("/hra/hradb_a_mongodb/solicitudes_control/no_enviadas/ANULAR")
        .set("Authorization", token);

      const solicitudesActualizadas = await SolicitudesCambiarOAnularHorasMedicas.find({
        tipoSolicitud: "ANULAR",
        enviadaHospital: true,
      });

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(solicitudesActualizadas.length).toBe(4);

      done();
    });
    it("Should get only 100 solicitudes de control no enviadas", async (done) => {
      await SolicitudesCambiarOAnularHorasMedicas.deleteMany();
      await SolicitudesCambiarOAnularHorasMedicas.create(cienSolicitudesCambiarOAnularHorasMedicasSeed);
      const response = await request
        .get("/hra/hradb_a_mongodb/solicitudes_control/no_enviadas/ANULAR")
        .set("Authorization", token);

      const solicitudesActualizadas = await SolicitudesCambiarOAnularHorasMedicas.find({
        tipoSolicitud: "ANULAR",
        enviadaHospital: true,
      });

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(100);
      expect(solicitudesActualizadas.length).toBe(100);

      done();
    });
  });
  describe("Update solicitud de control as respondida and add correlativoCita depending on tipoSolicitud", () => {
    it("Should not update estado solicitud control", async (done) => {
      const newSolicitudControl = await SolicitudesCambiarOAnularHorasMedicas.create({
        correlativoSolicitud: null,
        numeroPaciente: 123,
        correlativoCita: null,
        tipoSolicitud: "ANULAR",
        respondida: false,
      });

      const response = await request
        .put(
          `/hra/hradb_a_mongodb/solicitudes_control/${newSolicitudControl._id}`
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
    it("Should not update estado of non existing solicitud", async (done) => {
      const response = await request
        .put(
          `/hra/hradb_a_mongodb/solicitudes_control/60a26ce906ec5a89b4fd6240`
        )
        .set("Authorization", token)
        .send({
          correlativoSolicitud: 789,
          correlativoCita: 456,
          respondida: true,
        });

      expect(response.status).toBe(404);
      expect(response.body.respuesta).toBe("Solicitud no encontrada.");

      done();
    });
    it("Should update estado solicitud de control as respondida and add correlativoCita", async (done) => {
      const newSolicitudControl = await SolicitudesCambiarOAnularHorasMedicas.create({
        correlativoSolicitud: null,
        numeroPaciente: 123,
        correlativoCita: null,
        tipoSolicitud: "ANULAR",
        respondida: false,
      });

      const response = await request
        .put(
          `/hra/hradb_a_mongodb/solicitudes_control/${newSolicitudControl._id}`
        )
        .set("Authorization", token)
        .send({
          correlativoSolicitud: 789,
          correlativoCita: 456,
          respondida: true,
        });

      const solicitudControlActualizada = await SolicitudesCambiarOAnularHorasMedicas.findById(
        newSolicitudControl._id
      );

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});

      expect(solicitudControlActualizada.correlativoSolicitud).toBe(789);
      expect(solicitudControlActualizada.correlativoCita).toBe(456);
      expect(solicitudControlActualizada.respondida).toBeTruthy();

      done();
    });
    it("Should update estado solicitud de control as respondida and keep correlativoCita", async (done) => {
      const newSolicitudControl = await SolicitudesCambiarOAnularHorasMedicas.create({
        correlativoSolicitud: null,
        numeroPaciente: 123,
        correlativoCita: 987,
        tipoSolicitud: "ANULAR",
        respondida: false,
      });

      const response = await request
        .put(
          `/hra/hradb_a_mongodb/solicitudes_control/${newSolicitudControl._id}`
        )
        .set("Authorization", token)
        .send({
          _id: newSolicitudControl._id,
          correlativoSolicitud: 789,
          correlativoCita: null,
          respondida: true,
        });

      const solicitudControlActualizada = await SolicitudesCambiarOAnularHorasMedicas.findById(
        newSolicitudControl._id
      );

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});

      expect(solicitudControlActualizada.correlativoSolicitud).toBe(789);
      expect(solicitudControlActualizada.correlativoCita).toBe(987);
      expect(solicitudControlActualizada.respondida).toBeTruthy();

      done();
    });
  });
});

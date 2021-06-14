const supertest = require ('supertest')
const app = require('../api/index')
const mongoose = require('mongoose')
const CitasPacientes = require('../api/models/CitasPacientes')
const citasPacientesSeeds = require('../api/testSeeds/citaspacientesSeed.json')


const request = supertest(app)

const token = process.env.HRADB_A_MONGODB_SECRET

beforeEach(async () => {
    await mongoose.disconnect()
    await mongoose.connect(`${process.env.MONGO_URI_TEST}citas_pacientes_test`, { useNewUrlParser: true, useUnifiedTopology: true })
    await CitasPacientes.deleteMany()
    await CitasPacientes.create(citasPacientesSeeds)
})

afterEach(async () => {
    await CitasPacientes.deleteMany()
    await mongoose.disconnect()
})

const citaPacienteGuardar = [{
    correlativoCita: 11,
    nombreLugar: 'nombreLugar',
    nombreServicio: 'nombreServicio',
    nombreProfesional: 'nombreProfesional',
    fechaCitacion: '2021-10-30T04:00:00.000Z',
    horaCitacion: '10:30',
    numeroPaciente: 16,
    codigoAmbito: '01'
}]

describe('Endpoints citas pacientes', () => {
    describe('Get last cita paciente', () => {
        it('Should not get last cita paciente', async (done) => {
            const response = await request.get('/hra/hradb_a_mongodb/citas_pacientes/ultimo')
                .set('Authorization', 'no-token')
            expect(response.status).toBe(401)

            done()
        })
        it('Should get last cita paciente from empty database', async (done) => {
            await CitasPacientes.deleteMany()
            const response = await request.get('/hra/hradb_a_mongodb/citas_pacientes/ultimo')
                .set('Authorization', token)
            expect(response.status).toBe(200)
            expect(response.body).toEqual({})

            done()
        })
        it('Should get last cita paciente from database', async (done) => {
            await CitasPacientes.create(citaPacienteGuardar)
            const response = await request.get('/hra/hradb_a_mongodb/citas_pacientes/ultimo')
                .set('Authorization', token)
            expect(response.status).toBe(200)
            expect(response.body.correlativoCita).toBe(citaPacienteGuardar[0].correlativoCita)
            expect(response.body.nombreLugar).toBe(citaPacienteGuardar[0].nombreLugar)
            expect(response.body.nombreServicio).toBe(citaPacienteGuardar[0].nombreServicio)
            expect(response.body.nombreProfesional).toBe(citaPacienteGuardar[0].nombreProfesional)
            expect(Date.parse(response.body.fechaCitacion)).toBe(Date.parse(citaPacienteGuardar[0].fechaCitacion))
            expect(response.body.horaCitacion).toBe(citaPacienteGuardar[0].horaCitacion)
            expect(response.body.numeroPaciente).toBe(citaPacienteGuardar[0].numeroPaciente)
            expect(response.body.codigoAmbito).toBe(citaPacienteGuardar[0].codigoAmbito)

            done()
        })
    })
    describe('Save cita paciente', () => {
        it('Should not save cita paciente to database', async (done) => {
            const response = await request.post('/hra/hradb_a_mongodb/citas_pacientes/')
                .set('Authorization', 'no-token')
                .send(citaPacienteGuardar)
            const citaPacienteObtenida = await CitasPacientes.findOne({ correlativoCita: citaPacienteGuardar[0].correlativoCita })
            expect(response.status).toBe(401)
            expect(citaPacienteObtenida).toBeFalsy()

            done()
        })
        it('Should save cita paciente to database', async (done) => {
            const response = await request.post('/hra/hradb_a_mongodb/citas_pacientes/')
                .set('Authorization', token)
                .send(citaPacienteGuardar)
            const citaPacienteObtenida = await CitasPacientes.findOne({ correlativoCita: citaPacienteGuardar[0].correlativoCita })
            expect(response.status).toBe(201)
            expect(citaPacienteObtenida.correlativoCita).toBe(citaPacienteGuardar[0].correlativoCita)
            expect(citaPacienteObtenida.nombreLugar).toBe(citaPacienteGuardar[0].nombreLugar)
            expect(citaPacienteObtenida.nombreServicio).toBe(citaPacienteGuardar[0].nombreServicio)
            expect(citaPacienteObtenida.nombreProfesional).toBe(citaPacienteGuardar[0].nombreProfesional)
            expect(Date.parse(citaPacienteObtenida.fechaCitacion)).toBe(Date.parse(citaPacienteGuardar[0].fechaCitacion))
            expect(citaPacienteObtenida.horaCitacion).toBe(citaPacienteGuardar[0].horaCitacion)
            expect(citaPacienteObtenida.numeroPaciente).toBe(citaPacienteGuardar[0].numeroPaciente)
            expect(citaPacienteObtenida.codigoAmbito).toBe(citaPacienteGuardar[0].codigoAmbito)

            done()
        })
    })
    describe('Delete cita paciente', () => {
        it('Should not delete cita paciente from database', async (done) => {
            await CitasPacientes.create(citaPacienteGuardar)
            const response = await request.delete(`/hra/hradb_a_mongodb/citas_pacientes/${citaPacienteGuardar[0].correlativoCita}`)
                .set('Authorization', 'no-token')
            const citaPacienteObtenida = await CitasPacientes.findOne({ correlativoCita: citaPacienteGuardar[0].correlativoCita })
            expect(response.status).toBe(401)
            expect(citaPacienteObtenida).toBeTruthy()

            done()
        })
        it('Should delete cita paciente from database', async (done) => {
            await CitasPacientes.create(citaPacienteGuardar)
            const response = await request.delete(`/hra/hradb_a_mongodb/citas_pacientes/${citaPacienteGuardar[0].correlativoCita}`)
                .set('Authorization', token)
            const citaPacienteObtenida = await CitasPacientes.findOne({ correlativoCita: citaPacienteGuardar[0].correlativoCita })
            expect(response.status).toBe(204)
            expect(citaPacienteObtenida).toBeFalsy()

            done()
        })
        it('Should not fail if cita paciente does not exists', async (done) => {
            const response = await request.delete(`/hra/hradb_a_mongodb/citas_pacientes/${citaPacienteGuardar[0].correlativoCita}`)
                .set('Authorization', token)
            expect(response.status).toBe(204)

            done()
        })
    })
})
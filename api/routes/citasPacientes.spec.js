const supertest = require ('supertest')
const app = require('../index')
const mongoose = require('mongoose')
const CitasPacientes = require('../models/CitasPacientes')
const citasPacientesSeeds = require('../testSeeds/citaspacientesSeed.json')

const request = supertest(app)

const token = process.env.HRADB_A_MONGODB_SECRET

beforeEach(async () => {
    await mongoose.disconnect()
    await mongoose.connect(`${process.env.MONGO_URI_TEST}citas_pacientes_test`, { useNewUrlParser: true, useUnifiedTopology: true })
    await CitasPacientes.create(citasPacientesSeeds)
})

afterEach(async () => {
    await CitasPacientes.deleteMany()
    await mongoose.disconnect()
})

const citaPacienteGuardar = {
    CorrelativoCita: 11,
    NombreLugar: 'NombreLugar',
    NombreServicio: 'NombreServicio',
    NombreProfesional: 'NombreProfesional',
    FechaCitacion: '2021-10-30',
    HoraCitacion: '10:30',
    NumeroPaciente: 16,
    CodigoAmbito: '01'
}

describe('Endpoints citas pacientes', () => {
    describe('Get last cita paciente', () => {
        it('Should not get last cita paciente', async (done) => {
            const response = await request.get('/hra/hradb_a_mongodb/citas_pacientes/ultimo')
                .set('Authorization', 'no-token')
            expect(response.status).toBe(403)

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
            expect(response.body.CorrelativoCita).toBe(citaPacienteGuardar.CorrelativoCita)
            expect(response.body.NombreLugar).toBe(citaPacienteGuardar.NombreLugar)
            expect(response.body.NombreServicio).toBe(citaPacienteGuardar.NombreServicio)
            expect(response.body.NombreProfesional).toBe(citaPacienteGuardar.NombreProfesional)
            expect(Date.parse(response.body.FechaCitacion)).toBe(Date.parse(citaPacienteGuardar.FechaCitacion))
            expect(response.body.HoraCitacion).toBe(citaPacienteGuardar.HoraCitacion)
            expect(response.body.NumeroPaciente).toBe(citaPacienteGuardar.NumeroPaciente)
            expect(response.body.CodigoAmbito).toBe(citaPacienteGuardar.CodigoAmbito)

            done()
        })
    })
    describe('Save cita paciente', () => {
        it('Should not save cita paciente to database', async (done) => {
            const response = await request.post('/hra/hradb_a_mongodb/citas_pacientes/')
                .set('Authorization', 'no-token')
                .send(citaPacienteGuardar)
            const citaPacienteObtenida = await CitasPacientes.findOne({ CorrelativoCita: citaPacienteGuardar.CorrelativoCita })
            expect(response.status).toBe(403)
            expect(citaPacienteObtenida).toBeFalsy()

            done()
        })
        it('Should save cita paciente to database', async (done) => {
            const response = await request.post('/hra/hradb_a_mongodb/citas_pacientes/')
                .set('Authorization', token)
                .send(citaPacienteGuardar)
            const citaPacienteObtenida = await CitasPacientes.findOne({ CorrelativoCita: citaPacienteGuardar.CorrelativoCita })
            expect(response.status).toBe(201)
            expect(citaPacienteObtenida.CorrelativoCita).toBe(citaPacienteGuardar.CorrelativoCita)
            expect(citaPacienteObtenida.NombreLugar).toBe(citaPacienteGuardar.NombreLugar)
            expect(citaPacienteObtenida.NombreServicio).toBe(citaPacienteGuardar.NombreServicio)
            expect(citaPacienteObtenida.NombreProfesional).toBe(citaPacienteGuardar.NombreProfesional)
            expect(Date.parse(citaPacienteObtenida.FechaCitacion)).toBe(Date.parse(citaPacienteGuardar.FechaCitacion))
            expect(citaPacienteObtenida.HoraCitacion).toBe(citaPacienteGuardar.HoraCitacion)
            expect(citaPacienteObtenida.NumeroPaciente).toBe(citaPacienteGuardar.NumeroPaciente)
            expect(citaPacienteObtenida.CodigoAmbito).toBe(citaPacienteGuardar.CodigoAmbito)

            done()
        })
    })
    describe('Delete cita paciente', () => {
        it('Should not delete cita paciente from database', async (done) => {
            await CitasPacientes.create(citaPacienteGuardar)
            const response = await request.delete(`/hra/hradb_a_mongodb/citas_pacientes/${citaPacienteGuardar.CorrelativoCita}`)
                .set('Authorization', 'no-token')
            const citaPacienteObtenida = await CitasPacientes.findOne({ CorrelativoCita: citaPacienteGuardar.CorrelativoCita })
            expect(response.status).toBe(403)
            expect(citaPacienteObtenida).toBeTruthy()

            done()
        })
        it('Should delete cita paciente from database', async (done) => {
            await CitasPacientes.create(citaPacienteGuardar)
            const response = await request.delete(`/hra/hradb_a_mongodb/citas_pacientes/${citaPacienteGuardar.CorrelativoCita}`)
                .set('Authorization', token)
            const citaPacienteObtenida = await CitasPacientes.findOne({ CorrelativoCita: citaPacienteGuardar.CorrelativoCita })
            expect(response.status).toBe(204)
            expect(citaPacienteObtenida).toBeFalsy()

            done()
        })
        it('Should not fail if cita paciente does not exists', async (done) => {
            const response = await request.delete(`/hra/hradb_a_mongodb/citas_pacientes/${citaPacienteGuardar.CorrelativoCita}`)
                .set('Authorization', token)
            expect(response.status).toBe(204)

            done()
        })
    })
})
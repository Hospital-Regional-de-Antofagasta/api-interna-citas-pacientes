const supertest = require ('supertest')
const app = require('../index')
const mongoose = require('mongoose')
const HorasMedicas = require('../models/HorasMedicas')
const horasMedicasSeeds = require('../testSeeds/horasMedicasSeed.json')

const request = supertest(app)

const token = process.env.HRADB_A_MONGODB_SECRET

beforeEach(async () => {
    await mongoose.disconnect()
    await mongoose.connect(`${process.env.MONGO_URI_TEST}horas_medicas_test`, { useNewUrlParser: true, useUnifiedTopology: true })
    for (const horaMedicaSeed of horasMedicasSeeds) {
        await HorasMedicas.create(horaMedicaSeed)
    }
})

afterEach(async () => {
    await HorasMedicas.deleteMany()
    await mongoose.disconnect()
})

const horaMedicaGuardar = {
    CorrelativoHora: 11,
    NombreLugar: 'NombreLugar',
    NombreServicio: 'NombreServicio',
    NombreProfesional: 'NombreProfesional',
    FechaCitacion: '2021-10-30',
    HoraCitacion: '10:30',
    NumeroPaciente: 16,
}

describe('Endpoints horas medicas', () => {
    describe('Get last hora medica', () => {
        it('Should not get last hora medica', async (done) => {
            const response = await request.get('/hra/hradb_a_mongodb/horas_medicas/ultimo')
                .set('Authorization', 'no-token')
            expect(response.status).toBe(403)

            done()
        })
        it('Should get last hora medica from empty database', async (done) => {
            await HorasMedicas.deleteMany()
            const response = await request.get('/hra/hradb_a_mongodb/horas_medicas/ultimo')
                .set('Authorization', token)
            expect(response.status).toBe(200)
            expect(response.body).toEqual({})

            done()
        })
        it('Should get last hora medica from database', async (done) => {
            await HorasMedicas.create(horaMedicaGuardar)
            const response = await request.get('/hra/hradb_a_mongodb/horas_medicas/ultimo')
                .set('Authorization', token)
            expect(response.status).toBe(200)
            expect(response.body.CorrelativoHora).toBe(horaMedicaGuardar.CorrelativoHora)
            expect(response.body.NombreLugar).toBe(horaMedicaGuardar.NombreLugar)
            expect(response.body.NombreServicio).toBe(horaMedicaGuardar.NombreServicio)
            expect(response.body.NombreProfesional).toBe(horaMedicaGuardar.NombreProfesional)
            expect(Date.parse(response.body.FechaCitacion)).toBe(Date.parse(horaMedicaGuardar.FechaCitacion))
            expect(response.body.HoraCitacion).toBe(horaMedicaGuardar.HoraCitacion)
            expect(response.body.NumeroPaciente).toBe(horaMedicaGuardar.NumeroPaciente)

            done()
        })
    })
    describe('Save hora medica', () => {
        it('Should not save hora medica to database', async (done) => {
            const response = await request.post('/hra/hradb_a_mongodb/horas_medicas/')
                .set('Authorization', 'no-token')
                .send(horaMedicaGuardar)
            const horaMedicaObtenida = await HorasMedicas.findOne({ CorrelativoHora: horaMedicaGuardar.CorrelativoHora })
            expect(response.status).toBe(403)
            expect(horaMedicaObtenida).toBeFalsy()

            done()
        })
        it('Should save hora medica to database', async (done) => {
            const response = await request.post('/hra/hradb_a_mongodb/horas_medicas/')
                .set('Authorization', token)
                .send(horaMedicaGuardar)
            const horaMedicaObtenida = await HorasMedicas.findOne({ CorrelativoHora: horaMedicaGuardar.CorrelativoHora })
            expect(response.status).toBe(201)
            expect(horaMedicaObtenida.CorrelativoHora).toBe(horaMedicaGuardar.CorrelativoHora)
            expect(horaMedicaObtenida.NombreLugar).toBe(horaMedicaGuardar.NombreLugar)
            expect(horaMedicaObtenida.NombreServicio).toBe(horaMedicaGuardar.NombreServicio)
            expect(horaMedicaObtenida.NombreProfesional).toBe(horaMedicaGuardar.NombreProfesional)
            expect(Date.parse(horaMedicaObtenida.FechaCitacion)).toBe(Date.parse(horaMedicaGuardar.FechaCitacion))
            expect(horaMedicaObtenida.HoraCitacion).toBe(horaMedicaGuardar.HoraCitacion)
            expect(horaMedicaObtenida.NumeroPaciente).toBe(horaMedicaGuardar.NumeroPaciente)

            done()
        })
    })
    describe('Delete hora medica', () => {
        it('Should not delete hora medica from database', async (done) => {
            await HorasMedicas.create(horaMedicaGuardar)
            const response = await request.delete(`/hra/hradb_a_mongodb/horas_medicas/${horaMedicaGuardar.CorrelativoHora}`)
                .set('Authorization', 'no-token')
            const horaMedicaObtenida = await HorasMedicas.findOne({ CorrelativoHora: horaMedicaGuardar.CorrelativoHora })
            expect(response.status).toBe(403)
            expect(horaMedicaObtenida).toBeTruthy()

            done()
        })
        it('Should delete hora medica from database', async (done) => {
            await HorasMedicas.create(horaMedicaGuardar)
            const response = await request.delete(`/hra/hradb_a_mongodb/horas_medicas/${horaMedicaGuardar.CorrelativoHora}`)
                .set('Authorization', token)
            const horaMedicaObtenida = await HorasMedicas.findOne({ CorrelativoHora: horaMedicaGuardar.CorrelativoHora })
            expect(response.status).toBe(204)
            expect(horaMedicaObtenida).toBeFalsy()

            done()
        })
        it('Should not fail if hora medica does not exists', async (done) => {
            const response = await request.delete(`/hra/hradb_a_mongodb/horas_medicas/${horaMedicaGuardar.CorrelativoHora}`)
                .set('Authorization', token)
            expect(response.status).toBe(204)

            done()
        })
    })
})
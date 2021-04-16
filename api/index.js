const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const horasMedicas = require('./routes/horasMedicas')

const app = express()

app.use(express.json())
app.use(cors())

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true })

app.use('/hra/hradb_a_mongodb/horas_medicas', horasMedicas)

module.exports = app
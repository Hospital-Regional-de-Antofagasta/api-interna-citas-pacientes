const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const citasPacientes = require('./routes/citasPacientes')

const app = express()

app.use(express.json())
app.use(cors())

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true })

app.use('/hra/hradb_a_mongodb/citas_pacientes', citasPacientes)

module.exports = app
const express = require('express')
const horasMedicasController = require('../controllers/horasMedicasController')
const { isAuthenticated } = require('../middleware/auth')

const router = express.Router()

router.get('/ultimo', isAuthenticated, horasMedicasController.getLast)

router.post('/', isAuthenticated, horasMedicasController.create)

router.delete('/:correlativoHora', isAuthenticated, horasMedicasController.delete)

module.exports = router
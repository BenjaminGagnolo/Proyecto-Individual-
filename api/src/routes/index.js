const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const Dog = require('./dogs');
const Temperament = require('./temperament')
const Breeds = require('../routes/Breeds')
const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
// modularitation of routes 
router.use('/dogs', Dog)
router.use('/', Temperament)
router.use('/breedGroups', Breeds) //No llegue




module.exports = router;

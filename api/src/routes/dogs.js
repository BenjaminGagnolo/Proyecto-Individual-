const { Router } = require('express');
const db = require('../db');
const router = Router();
const { getDogsName , getDogsId, postDogs } = require('../Controllers/dogs')



//I manage everything from controller


router.get('/', getDogsName)

router.get('/:id', getDogsId)

router.post('/', postDogs)
    

module.exports = router;
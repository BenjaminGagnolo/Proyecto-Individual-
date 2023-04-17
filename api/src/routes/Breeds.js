const { Router } = require('express');
const db = require('../db');
const router = Router();
const { Temperament, Dog } = require('../db');
const { getDogs } = require('../Controllers/dogs')

router.get('/', async (req, res) => {
    try {
        const everyDog = await getDogs();
        const everyBreedGroup = everyDog?.map((dog) => {
            if (!dog.breed_group) {
                "No info"
            } else { return dog.breed_group }
        });
        const eachBreedGroup = [...new Set(everyBreedGroup.flat())]
        res.status(200).json(eachBreedGroup.sort())
    } catch (error) {
        console.log(error, "Error on breeds route")
    }

});

router.get('/', async (req, res) => {
    const breedGroup = req.query.breedGroup;
    const everyDog = await getDogs();
    const dogSearchResult = everyDog.filter((dog) => {
        if (breedGroup === 'all') return everyDog
        else if (dog.breed_group !== undefined) { return (dog.breed_group.toLowerCase()).includes(breedGroup.toLowerCase()) }
    });
    res.status(200).json(dogSearchResult)
});

module.exports = router;
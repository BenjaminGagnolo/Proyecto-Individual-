const { Router } = require('express');
const { Dog , Temperament} = require('../db');
const router = Router();
const { getTemperaments } = require('../Controllers/temperaments.js');
const { getDogs } = require('../Controllers/dogs');


router.get('/temperament', async(req,res)=>{
    try {
        const temp = await getTemperaments()
        res.status(200).send(temp)
    } catch (error) {
        console.log(error);
    }
})

router.get('/dog/', async(req,res)=>{
    const temperament = req.query.temperament;
    const everyDog = await getDogs();
    const dogSearchResult = everyDog.filter((dog) => {
        if (temperament === 'all') return everyDog
        else if (dog.temperament) {
            return (dog.temperament.toLowerCase()).includes(temperament.toLowerCase())
        }
    });
    res.status(200).json(dogSearchResult)
});

router.post('temperament/:temperament', async(req,res)=>{
    try{
        const newTemperament = req.params.temperament;
        const postedTemp = await Temperament.create({
           name: newTemperament,
        });
        return res.status(200).json(postedTemp)
        } catch (error) {
            res.status(404).send(error)
        }
    });




module.exports = router;
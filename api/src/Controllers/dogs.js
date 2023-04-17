require('dotenv').config();
const axios = require('axios');
const { Dog, Temperament } = require('../db');
const { API_KEY } = process.env;

const getDogs = async (req, res) => {
    try {
        const allDogs = await axios.get(`https://api.thedogapi.com/v1/breeds?api_key=${API_KEY}`)
        //Traigo todos los datos de la api BUSCAR UNA NUEVA FORMA 
        if (allDogs.data) {
            var allBreeds = allDogs.data.map(e => {
                let weight = e.weight.metric.split('-')
                let height = e.height.metric.split('-')
                let life_span = e.life_span.split('-')
                let weightMin = parseInt(weight[0])
                let weightMax = parseInt(weight[1]) //Como tienen dos datos, trabajo por separado
                let heightMin = parseInt(height[0])
                let heightMax = parseInt(height[1])
                let life_span_min = parseInt(life_span[0])
                let life_span_max = parseInt(life_span[1])
                return {
                    id: e.id,
                    name: e.name,
                    heightMin: heightMin ? heightMin : heightMax,
                    heightMax: heightMax ? heightMax : heightMin,
                    weightMin: weightMin ? weightMin : weightMax,
                    weightMax: weightMax ? weightMax : weightMin,
                    life_span_min: life_span_min ? life_span_min : life_span_max,
                    life_span_max: life_span_max ? life_span_max : life_span_min,
                    temperament: e.temperament ? e.temperament : 'Not Temperament',
                    image: e.image.url
                }
            })

        }

        var dbDogs = await Dog.findAll({ //Busco en la base de datos
            include: [{
                model: Temperament,
                attributes: ['name'],
                through: {
                    attributes: []
                }
            }]
        })

        var dbBreeds = dbDogs.map(e => { //Armo el objeto de Dog
            return {
                id: e.id,
                name: e.name,
                heightMin: e.heightMin,
                heightMax: e.heightMax,
                weightMin: e.weightMin,
                weightMax: e.weightMax,
                life_span_min: e.life_span_min,
                life_span_max: e.life_span_max,
                temperament: e.dataValues.temperaments.map(el => el.name).join(', '),
                image: e.image,
                createdInDB: e.createdInDB,
            }

        })
        var allBreedsApi = [...allBreeds, ...dbBreeds] 
        return allBreedsApi
    } catch (error) {
        console.log(error)
    }


}
const getDogsName= async (req, res) =>{
    const { name } = req.query;
    try {
        var allData = await getDogs();
        if(name) {
           var searchName = allData.filter(dog => dog.name.toLowerCase().includes(name.toLowerCase()))
            searchName.length>0 ? res.status(200).json(searchName) : res.status(404).send({'msg': 'Breed not found'})
        } else {
            res.status(200).json(allData)
        }
    } catch (error) {
        console.log(error)
    }
}  

const getDogsId = async (req,res)=>{
    const { id } = req.params;
    var allId = await getDogs();
    try {
        if (id) {
            let breedId = allId.filter(el => (el.id === Number(id) || el.id === String(id)))
           
            breedId.length>0 ? res.status(200).json(breedId) : res.status(404).send('Breed not found')
        }
    } catch (error) {
        console.log(error);
    }
}

const postDogs = async(req,res)=>{
    const { name, heightMin, heightMax, weightMin, weightMax, life_span_min, life_span_max, temperament, image } = req.body;
    try {
        const newBreed = await Dog.create({
            name,
            heightMin,
            heightMax,
            weightMin,
            weightMax,
            life_span_min,
            life_span_max,
            image
                     
        });
        await newBreed.addTemperaments(temperament)
        res.status(201).json(newBreed).send({"msg": "Breed Created"})
    } catch (error) {
        console.log(error)
    }
}




module.exports = {
    getDogs,
    getDogsName,
    getDogsId,
    postDogs

}
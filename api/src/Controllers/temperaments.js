require('dotenv').config();
const { Dog, Temperament } = require('../db');
const axios = require('axios');
const { API_KEY } = process.env;

const getTemperaments = async () =>{
    const apiData = await axios.get(`https://api.thedogapi.com/v1/breeds?api_key=${API_KEY}`)
    const tempList = apiData.data.map((e) => e.temperament?.split(", ")).flat();
    const temperament = [...new Set(tempList)]

    temperament.forEach((e)=>{
        if (e) {
            Temperament.findOrCreate({
                where:{name : e}
            })
        }
    })
    let allTemp = await Temperament.findAll()
    return allTemp
}


module.exports = {
    getTemperaments
}
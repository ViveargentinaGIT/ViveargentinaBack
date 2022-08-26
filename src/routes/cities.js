const { Router } = require("express");
const { Package, City, Region } = require("../database");
const { Op } = require('sequelize');

const router = Router();

router.get("/", async (req, res) => {
  const { name } = req.query;
  try {
    if(name) {
      let searchedCity = await City.findAll({where: {
        [Op.or]: [
          {name: {[Op.substring]: name}},
          {name: {[Op.substring]: name[0].toUpperCase() + name.slice(1)}},
          {name: name[0].toUpperCase() + name.slice(1)},
        ]}}, {include: Region})
      searchedCity.length > 0 ? 
      res.status(201).json(searchedCity) :
      res.status(404).send('City not found')
    } else {
      const allCities = await City.findAll({include: Region});
      return res.status(200).send(allCities);
    }
  } catch (err) {
    res.status(400).json({error: err.message});
  }
});

router.get("/:cityId", async (req, res) => {
  try {
    const { cityId } = req.params;
    const searchedCity = await City.findAll({where: {id: cityId}}, {include: Region});
    return res.status(200).send(searchedCity);
  } catch (err) {
    res.status(400).json({error: err.message});
  }
});

router.post("/", async (req, res) => {
  const { name, description, image, video, regionId } = req.body;
  if (!name || !description) return res.status(201).send("You must enter a name and a description");
  try {
    let newCity = await City.create({name, description, image, video});
    let selectedRegion = await Region.findByPk(regionId);
    newCity.setRegion(selectedRegion);
    return res.status(201).json(newCity);
  } catch (err) {
    return res.status(404).send("There was an error in the creation of the city");
  }
});

router.delete('/:cityId', async (req, res) => {
  const {cityId} = req.params;
  try {
    await City.destroy({where: {id: cityId}});
    res.status(200).send('City deleted successfully');
  } catch (err) {
    res.status(404).json({error: err.message});
  }
});

module.exports = router;

const { Router } = require("express");
const { Package, City, Region, Experience } = require("../database");
const { Op } = require("sequelize");

const router = Router();

router.get("/:cityId", async (req, res) => {
  const { cityId } = req.params;
  try {
    const searchedCity = await City.findByPk(cityId, {
      include: [Region, {model: Package, include: [Experience]}],
    });
    return res.status(200).send(searchedCity);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const removeAccents = (str) => {
 return str.normalize("NFD").replace(/[\u0300-\u036f]/g,"");
}

router.get("/", async (req, res) => {
  let { name } = req.query;
  try {
    if (name) {
      let citiesArray = await City.findAll({include: [Region, Package]});
      let searchedCities = citiesArray.filter(e => removeAccents(e.name).toLowerCase().includes(removeAccents(name).toLowerCase()))
      console.log(searchedCities)
      res.status(201).json(searchedCities)
    } else {
      const allCities = await City.findAll({ include: [Region, Package] });
      return res.status(200).send(allCities);
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  const { id, name, subTitle, score, description, image, video, regionId } =
    req.body;
  if (!name /*|| !description || !score*/)
    return res
      .status(201)
      .send("You must enter a name, score and a description");
  try {
    let newCity = await City.create({
      name: name,
      description,
      image,
      video,
      subTitle,
      score,
      id
    });
    let selectedRegion = await Region.findByPk(regionId);
    newCity.setRegion(selectedRegion);
    return res.status(201).json(newCity);
  } catch (err) {
    // return res.status(404).send("There was an error in the creation of the city");
    res.status(404).json({ error: err.message });
  }
});

router.delete("/:cityId", async (req, res) => {
  const { cityId } = req.params;
  try {
    await City.destroy({ where: { id: cityId } });
    res.status(200).send("City deleted successfully");
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

router.put("/", async (req, res) => {
  const { cityId } = req.query;
  const { name, subTitle, score, description, image, video, regionId } =
    req.body;
  try {
    City.update(
      { name, subTitle, score, description, image, video, regionId },
      { where: { id: cityId } }
    );
    res.status(200).send("City updated successfully");
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

module.exports = router;

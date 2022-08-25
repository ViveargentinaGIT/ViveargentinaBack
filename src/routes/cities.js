const { Router } = require("express");
const { Package, City, Region } = require("../database");

const router = Router();

router.get("/", async (req, res) => {
  const { name } = req.query;
  try {
    const cities = await City.findAll({include: Region});
    if (cities.length > 0) return res.status(200).send(cities);
    else {
      return res.status(201).send("There are no cities yet");
    }
  } catch (err) {
    console.log(err);
    res.status(400).send("There was a problem with your search");
  }
});

router.get("/:cityID", async (req, res) => {
  try {
    const { cityID } = req.params;
    const selectedCity = await City.findAll({where: {id: cityID}}, {include: [{model: Region}]});
    console.log("selectedCity: ", selectedCity);
    if (selectedCity) return res.status(200).send(selectedCity);
    return res.status(201).send("There are no city with this ID");
  } catch (err) {
    console.log(err);
    res.status(400).send("An error ocurred while searching for the city");
  }
});

router.post("/", async (req, res) => {
  const { name, description, image, video, regionId } = req.body;
  if (!name || !description) return res.status(201).send("You must enter a name, image, video and description");
    try {
      let newCity = await City.create({name, description, image, video});
      // console.log("newCity:", newCity.dataValues)
      let selectedRegion = await Region.findAll({where: {id: regionId}});
      // console.log("selectedRegion:", selectedRegion)
      newCity.setRegion(selectedRegion);
      return res.status(201).json(newCity);
    } catch (err) {
      console.log(err);
      return res.status(404).send("There was an error in the creation of the package");
  }
});

module.exports = router;

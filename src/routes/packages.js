const { Router } = require("express");
const { Package, City, Experience } = require("../database");

const router = Router();

router.get("/", async (req, res) => {
  const { name } = req.query;
  try {
    const packages = await Package.findAll({
      include: City,
      Experience,
    });
    if (packages.length > 0) return res.status(200).send(packages);
    else {
      return res.status(201).send("There are no packages yet");
    }
  } catch (err) {
    console.log(err);
    res.status(400).send("There was a problem with your search");
  }
});

router.get("/:packageID", async (req, res) => {
  try {
    const { packageID } = req.params;
    const selectedPachage = await Package.findByPk(packageID, {
      include: City,
      Experience,
    });
    if (selectedPachage) return res.status(200).send(selectedPachage);
    else {
      return res.status(201).send("There are no expetience with this ID");
    }
  } catch (err) {
    console.log(err);
    res.status(400).send("An error ocurred while searching for the region");
  }
});

router.post("/", async (req, res) => {
  const {
    name,
    description,
    image,
    video,
    price,
    duration,
    stock,
    score,
    cityId,
  } = req.body;
  if (!name) {
    return res.status(201).send("You must enter a name");
  } else {
    try {
      const newPackage = await Package.create({
        name,
        price,
        description,
        image,
        video,
        duration,
        stock,
        score,
      });

      const selectedCity = await City.findByPk(cityId);
      newExperience.addCity(selectedCity);

      return res.status(201).json(newPackage);
    } catch (err) {
      console.log(err);
      return res
        .status(404)
        .send("There was an error in the creation of the package");
    }
  }
});

module.exports = router;

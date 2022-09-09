const { Router } = require("express");
const { Package, City, Experience } = require("../database");
const { Op } = require("sequelize");

const router = Router();

router.get("/:packageId", async (req, res) => {
  const { packageId } = req.params;
  try {
    const selectedPackage = await Package.findByPk(packageId, {
      include: [City, Experience],
    });
    return res.status(200).send(selectedPackage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const removeAccents = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g,"");
 }

router.get("/", async (req, res) => {
  const { name } = req.query;
  try {
    if (name) {
      let packagesArray = await Package.findAll({include: [City, Experience]});
      let searchedPackages = await packagesArray.filter(e => removeAccents(e.name).toLowerCase().includes(removeAccents(name).toLowerCase()))
      // searchedPackage.length > 0 ? 
      res.status(201).json(searchedPackages)
      // : res.status(404).send("Package not found");
    } else {
      const allPackages = await Package.findAll({
        include: [City, Experience],
      });
      return res.status(200).send(allPackages);
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  const {
    name,
    description,
    image,
    status,
    price,
    duration,
    available,
    score,
    subTitle,
    cityId,
    dates,
  } = req.body;
  if (!name) return res.status(201).send("You must enter a name");
  try {
    const newPackage = await Package.create({
      name: name,
      description,
      image,
      status,
      price,
      duration,
      available,
      score,
      subTitle,
      dates,
    });
    const selectedCity = await City.findByPk(cityId);
    newPackage.setCity(selectedCity);
    return res.status(201).json(newPackage);
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
});

router.delete("/:packageId", async (req, res) => {
  const { packageId } = req.params;
  try {
    await Package.destroy({ where: { id: packageId } });
    res.status(200).send("Package deleted successfully");
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

router.put("/", async (req, res) => {
  const { packageId } = req.query;
  const {
    name,
    description,
    image,
    status,
    price,
    duration,
    available,
    score,
    subTitle,
    dates,
    cityId,
  } = req.body;
  try {
    Package.update(
      {
        name,
        description,
        image,
        status,
        price,
        duration,
        available,
        score,
        subTitle,
        dates,
        cityId,
      },
      { where: { id: packageId } }
    );
    res.status(200).send("Package updated successfully");
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

module.exports = router;

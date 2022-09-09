const { Router } = require("express");
const { Category, Experience, Package } = require("../database");
const { Op } = require("sequelize");

const router = Router();

router.get("/:experienceId", async (req, res) => {
  const { experienceId } = req.params;
  try {
    const selectedExperience = await Experience.findByPk(experienceId, {
      include: [Category, Package],
    });
    return res.status(200).send(selectedExperience);
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
      let experiencesArray = await Experience.findAll({ include: [Category, Package]});
      let searchedExperiences = experiencesArray.filter(e => removeAccents(e.name).toLowerCase().includes(removeAccents(name).toLowerCase()))
      res.status(201).json(searchedExperiences)
    } else {
      const allExperiences = await Experience.findAll({
        include: [Category, Package],
      });
      return res.status(200).send(allExperiences);
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
    dates,
    categoryId,
    packageId,
  } = req.body;

  if (
    !name /*|| !subTitle || !price || !description || !image || !duration || !categoryId || !packageId*/
  )
    return res.status(201).send("You must complete the form");
  try {
    const newExperience = await Experience.create({
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
    const selectedCategory = await Category.findByPk(categoryId);
    const selectedPackage = await Package.findByPk(packageId);
    newExperience.setCategory(selectedCategory);
    newExperience.setPackage(selectedPackage);
    return res.status(201).json(newExperience);
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
});

router.delete("/:experienceId", async (req, res) => {
  const { experienceId } = req.params;
  try {
    await Experience.destroy({ where: { id: experienceId } });
    res.status(200).send("Experience deleted successfully");
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

router.put("/", async (req, res) => {
  const { experienceId } = req.query;
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
    categoryId,
    packageId,
  } = req.body;
  try {
    Experience.update(
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
        categoryId,
        packageId,
      },
      { where: { id: experienceId } }
    );
    res.status(200).send("Experience updated successfully");
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

module.exports = router;

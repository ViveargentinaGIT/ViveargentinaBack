const { Router } = require("express");
const { Category, Experience, Package } = require("../database");

const router = Router();

router.get("/", async (req, res) => {
  try {
    const allExperiences = await Experience.findAll({include: [Category, Package]});
    return res.status(200).send(allExperiences);
  } catch (err) {
    res.status(400).json({error: err.message});
  }
});

router.get("/:experienceId", async (req, res) => {
  const { experienceId } = req.params;
  try {
    const selectedExperience = await Experience.findByPk(experienceId, {include: [Category, Package]});
    return res.status(200).send(selectedExperience);
  } catch (err) {
    res.status(400).json({error: err.message});
  }
});

router.post("/", async (req, res) => {
  const {name, price, description, image, video, duration, stock, score, categoryId, packageId} = req.body;
  if (!name) return res.status(201).send("You must enter a name");
  try {
    const newExperience = await Experience.create({name, price, description, image, video, duration, stock, score});
    const selectedCategory = await Category.findByPk(categoryId);
    const selectedPackage = await Package.findByPk(packageId);
    newExperience.setCategory(selectedCategory);
    newExperience.setPackage(selectedPackage);
    return res.status(201).json(newExperience);
  } catch (err) {
    return res.status(404).json({error: err.message});
  }
});

router.delete('/:experienceId', async (req, res) => {
  const {experienceId} = req.params;
  try {
    await Experience.destroy({where: {id: experienceId}});
    res.status(200).send('Experience deleted successfully');
  } catch (err) {
    res.status(404).json({error: err.message});
  }
});

module.exports = router;

const { Router } = require("express");
const { Category, Experience, Package } = require("../database");
const { Op } = require('sequelize');

const router = Router();

router.get("/:experienceId", async (req, res) => {
  const { experienceId } = req.params;
  try {
    const selectedExperience = await Experience.findByPk(experienceId, {include: [Category, Package]});
    return res.status(200).send(selectedExperience);
  } catch (err) {
    res.status(400).json({error: err.message});
  }
});

router.get("/", async (req, res) => {
  const {name} = req.query;
  try {
  if(name) {
    let searchedExperience = await Experience.findAll({where: {
     [Op.or]: [
       {name: {[Op.substring]: name}},
       {name: {[Op.substring]: name[0].toUpperCase() + name.slice(1)}},
       {name: name[0].toUpperCase() + name.slice(1)},
      ]}}, {include: [Category, Package]})
    searchedExperience.length > 0 ? 
    res.status(201).json(searchedExperience) :
    res.status(404).send('Experience not found')
  } else {
    const allExperiences = await Experience.findAll({include: [Category, Package]});
    return res.status(200).send(allExperiences);
  }
  } catch (err) {
    res.status(400).json({error: err.message});
  }
});



router.post("/", async (req, res) => {

  const {name, subTitle, price, description, image, video, duration, stock, score, categoryId, packageId} = req.body;
  console.log(price, stock, score)
  if (!name) return res.status(201).send("You must enter a name");
  try {
    const newExperience = await Experience.create({name, price: parseInt(price), subTitle, description, image, video, duration, stock: parseInt(stock), score: parseInt(score)});
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

router.put('/', async (req, res) => {
  const {experienceId} = req.query;
  const { name, subTitle, price, description, image, video, duration, stock, score, categoryId, packageId } = req.body;
  try {
    Experience.update({name, subTitle, price, description, image, video, duration, stock, score, categoryId, packageId}, {where: {id: experienceId}});
    res.status(200).send('Experience updated successfully');
  } catch (err) {
    res.status(404).json({error: err.message});
  }
});

module.exports = router;

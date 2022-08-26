const { Router } = require("express");
const { Category, Experience } = require("../database");

const router = Router();

router.get("/", async (req, res) => {
  try {
    const categories = await Category.findAll({ include: Experience });
    return res.status(200).send(categories);
  } catch (err) {
    res.status(400).send("An error ocurred while searching for the regions");
  }
});

router.get("/:categoryId", async (req, res) => {
  const { categoryId } = req.params;
  const selectedCategory = await Category.findByPk(categoryId, {include: Experience});
  try {
    if (selectedCategory) return res.status(200).send(selectedCategory);
    return res.status(201).send("There are no region with this ID");
  } catch (err) {
    res.status(400).send("An error ocurred while searching for the region");
  }
});

router.post("/", async (req, res) => {
  const { name } = req.body;
  try {
    if (!name) return res.status(404).send("You must enter a name to create the new category");
    const newCategory = await Category.create({name: name});
    return res.status(201).json(newCategory);
  } catch (err) {
    return res.status(404).send("An error ocurred while creating the region");
  }
});

router.delete('/:categoryId', async (req, res) => {
  const {categoryId} = req.params;
  try {
    await Category.destroy({where: {id: categoryId}});
    res.status(200).send('Category deleted successfully')
  } catch (err) {
    res.status(404).json({error: err.message});
  }
});

module.exports = router;

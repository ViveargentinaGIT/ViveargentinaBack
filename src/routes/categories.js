const { Router } = require("express");
const { Category, Experience } = require("../database");

const router = Router();

router.get("/", async (req, res) => {
  try {
    const categories = await Category.findAll({ include: Experience });
    if (categories.length > 0) return res.status(200).send(categories);
    else {
      return res.status(201).send("There are no categories yet");
    }
  } catch (err) {
    console.log(err);
    res.status(400).send("An error ocurred while searching for the regions");
  }
});

router.get("/:categoryID", async (req, res) => {
  try {
    const { categoryID } = req.params;
    const selectedCategory = await Category.findByPk(categoryID, {
      include: Experience,
    });
    if (selectedCategory) return res.status(200).send(selectedCategory);
    else {
      return res.status(201).send("There are no region with this ID");
    }
  } catch (err) {
    console.log(err);
    res.status(400).send("An error ocurred while searching for the region");
  }
});

router.post("/", async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res
      .status(201)
      .send("You must enter a name to create the new category");
  } else {
    try {
      const newCategory = await Category.create({
        name: name.toLowerCase(),
      });
      return res.status(201).json(newCategory);
    } catch (err) {
      console.log(err);
      return res
        .status(404)
        .send("An error ocurred in the creation of the region");
    }
  }
});

module.exports = router;

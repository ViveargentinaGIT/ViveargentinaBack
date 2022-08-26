const { Router } = require("express");
const { Category, Experience, Package } = require("../database");

const router = Router();

router.get("/", async (req, res) => {
  try {
    const experiences = await Experience.findAll({
      include: [Package, Category],
    });
    if (experiences.length > 0) return res.status(200).send(experiences);
    else {
      return res.status(201).send("There are no experiences yet");
    }
  } catch (err) {
    console.log(err);
    res.status(400).send("There was a problem with your search");
  }
});

router.get("/:experienceID", async (req, res) => {
  try {
    const { experienceID } = req.params;
    const selectedExperience = await Experience.findByPk(experienceID, {
      include: [Package, Category],
    });
    if (selectedExperience) return res.status(200).send(selectedExperience);
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
    price,
    description,
    image,
    video,
    duration,
    stock,
    score,
    categoryId,
    packageId,
  } = req.body;
  if (!name) {
    return res.status(201).send("You must enter a name");
  } else {
    try {
      const newExperience = await Experience.create({
        name,
        price,
        description,
        image,
        video,
        duration,
        stock,
        score,
      });

      const selectedCategory = await Category.findByPk(categoryId);
      const selectedPackage = await Package.findByPk(packageId);

      newExperience.setCategory(selectedCategory);
      newExperience.setPackage(selectedPackage);

      return res.status(201).json(newExperience);
    } catch (err) {
      console.log(err);
      return res
        .status(404)
        .send("There was an error in the creation of the experience");
    }
  }
});

module.exports = router;

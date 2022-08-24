const { Router } = require("express");
const { Package } = require("../database");

const router = Router();

router.get("/", async (req, res) => {
    const {name} = req.query;
    try {
      const packages = await Experience.findAll();
      if (packages.length > 0) return res.status(200).send(packages);
      else {
        return res.status(201).send("There are no packages yet");
      }
    } catch (err) {
      console.log(err);
      res.status(400).send("There was a problem with your search");
    }
  });

  router.post("/", async (req, res) => {
    const {name, description, image, video, price, duration, stock, score} = req.body;
    if (!name) {
      return res.status(201).send("You must enter a name");
    } else {
      try {
        const newPackage = await Package.create({name, price, description, image, video, duration, stock, score});
        return res.status(201).json(newPackage);
      } catch (err) {
        console.log(err);
        return res.status(404).send("There was an error in the creation of the package");
      }
    }
  });

module.exports = router;
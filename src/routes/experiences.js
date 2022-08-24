const { Router } = require("express");
const { Category, Experience, Reservation, Provider, Package } = require("../database");

const router = Router();

router.get("/", async (req, res) => {
    try {
      const experiences = await Experience.findAll({include: Category, Package});
      if (experiences.length > 0) return res.status(200).send(experiences);
      else {
        return res.status(201).send("There are no experiences yet");
      }
    } catch (err) {
      console.log(err);
      res.status(400).send("There was a problem with your search");
    }
  });

  router.post("/", async (req, res) => {
    const {name, price, description, image, video, duration, stock, score} = req.body;
    if (!name) {
      return res.status(201).send("You must enter a name");
    } else {
      try {
        const newExperience = await Experience.create({name, price, description, image, video, duration, stock, score});
        return res.status(201).json(newExperience);
      } catch (err) {
        console.log(err);
        return res.status(404).send("There was an error in the creation of the experience");
      }
    }
  });

  module.exports = router;

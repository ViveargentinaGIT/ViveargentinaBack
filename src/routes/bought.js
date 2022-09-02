const { Router } = require("express");
const {
  Reservation_package,
  Reservation_experience,
  User,
  Experience,
  Package,
} = require("../database");
const { Op } = require("sequelize");

const router = Router();

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const boughtExperiences = await Reservation_experience.findAll({
      where: {
        [Op.and]: [{ userId: userId }, { bought: true }],
      },

      //  include: [User, Experience],
    });
    const boughtPackages = await Reservation_package.findAll({
      where: {
        [Op.and]: [{ userId: userId }, { bought: true }],
      },
      // include: [User, Package],
    });
    const boughtPackagesAndExperiences =
      boughtPackages.concat(boughtExperiences);
    return res.status(200).send(boughtPackagesAndExperiences);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/experiences", async (req, res) => {
  const { experienceId, userId } = req.query;

  if (!experienceId || !userId)
    return res.status(201).send("You must enter a experienceId and userId");
  try {
    let searchedBought = await Reservation_experience.findAll({
      where: {
        [Op.and]: [{ userId: userId }, { experienceId: experienceId }],
      },
    });

    if (searchedBought.length > 0) {
      Reservation_experience.update(
        { bought: true },
        {
          where: {
            [Op.and]: [{ userId: userId }, { experienceId: experienceId }],
          },
        }
      );
      return res.status(201).send("Bought added successfully");
    } else {
      let newBought = await Reservation_experience.create({
        bought: true,
        experienceId,
        userId,
      });
      return res.status(201).json(newBought);
    }
  } catch (err) {
    // return res.status(404).send("There was an error in the creation of the city");
    res.status(404).json({ error: err.message });
  }
});

router.post("/packages", async (req, res) => {
  const { packageId, userId } = req.query;

  if (!packageId || !userId)
    return res.status(201).send("You must enter a experienceId and userId");
  try {
    let searchedBought = await Reservation_package.findAll({
      where: {
        [Op.and]: [{ userId: userId }, { packageId: packageId }],
      },
    });

    if (searchedBought.length > 0) {
      Reservation_package.update(
        { bought: true },
        {
          where: {
            [Op.and]: [{ userId: userId }, { packageId: packageId }],
          },
        }
      );
      return res.status(201).send("Bought added successfully");
    } else {
      let newBought = await Reservation_package.create({
        bought: true,
        packageId,
        userId,
      });
      return res.status(201).json(newBought);
    }
  } catch (err) {
    // return res.status(404).send("There was an error in the creation of the city");
    res.status(404).json({ error: err.message });
  }
});

router.put("/experiences", async (req, res) => {
  const { experienceId, userId } = req.query;
  try {
    Reservation_experience.update(
      { bought: false },
      {
        where: {
          [Op.and]: [{ userId: userId }, { experienceId: experienceId }],
        },
      }
    );
    return res.status(201).send("Bought deleted successfully");
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

router.put("/packages", async (req, res) => {
  const { packageId, userId } = req.query;
  try {
    Reservation_package.update(
      { bought: false },
      {
        where: {
          [Op.and]: [{ userId: userId }, { packageId: packageId }],
        },
      }
    );
    return res.status(201).send("Bought deleted successfully");
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

module.exports = router;

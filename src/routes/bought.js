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
    const favoriteExperiences = await Reservation_experience.findAll(
      {
        where: {
          [Op.and]: [{ userId: userId }, { favorite: true }],
        },
      },
      {
        include: {
          model: Experience,
          attributes: ["name"],
          through: {
            attributes: [],
          },
        },
      }
    );
    const favoritePackages = await Reservation_package.findAll(
      {
        where: {
          [Op.and]: [{ userId: userId }, { favorite: true }],
        },
      },
      {
        include: [User, Package],
      }
    );
    const favoritePackagesAndExperiences =
      favoritePackages.concat(favoriteExperiences);
    return res.status(200).send(favoritePackagesAndExperiences);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/experiences", async (req, res) => {
  const { experienceId, userId } = req.query;

  if (!experienceId || !userId)
    return res.status(201).send("You must enter a experienceId and userId");
  try {
    let searchedFavorite = await Reservation_experience.findAll({
      where: {
        [Op.and]: [{ userId: userId }, { experienceId: experienceId }],
      },
    });

    if (searchedFavorite.length > 0) {
      Reservation_experience.update(
        { favorite: true },
        {
          where: {
            [Op.and]: [{ userId: userId }, { experienceId: experienceId }],
          },
        }
      );
      return res.status(201).send("Favorite added successfully");
    } else {
      let newFavorite = await Reservation_experience.create({
        favorite: true,
        experienceId,
        userId,
      });
      return res.status(201).json(newFavorite);
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
    let searchedFavorite = await Reservation_package.findAll({
      where: {
        [Op.and]: [{ userId: userId }, { packageId: packageId }],
      },
    });

    if (searchedFavorite.length > 0) {
      Reservation_package.update(
        { favorite: true },
        {
          where: {
            [Op.and]: [{ userId: userId }, { packageId: packageId }],
          },
        }
      );
      return res.status(201).send("Favorite added successfully");
    } else {
      let newFavorite = await Reservation_package.create({
        favorite: true,
        packageId,
        userId,
      });
      return res.status(201).json(newFavorite);
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
      { favorite: false },
      {
        where: {
          [Op.and]: [{ userId: userId }, { experienceId: experienceId }],
        },
      }
    );
    return res.status(201).send("Favorite deleted successfully");
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

router.put("/packages", async (req, res) => {
  const { packageId, userId } = req.query;
  try {
    Reservation_package.update(
      { favorite: false },
      {
        where: {
          [Op.and]: [{ userId: userId }, { packageId: packageId }],
        },
      }
    );
    return res.status(201).send("Favorite deleted successfully");
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

module.exports = router;

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
    const selectedUser = await User.findByPk(userId, {
      include: [Query, Review, Experience, Package],
    });

    let cartExperiences = selectedUser.experiences.filter((e) => {
      return e.reservation_experience.status === "cart";
    });
    let cartPackages = selectedUser.packages.filter((e) => {
      return e.reservation_package.status === "cart";
    });

    const cartPackagesAndExperiences = cartPackages.concat(cartExperiences);
    return res.status(200).send(cartPackagesAndExperiences);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const cartExperiences = await Reservation_experience.findAll({
      where: { status: "cart" },
    });
    const cartPackages = await Reservation_package.findAll({
      where: { status: "cart" },
    });
    const cartPackagesAndExperiences = cartPackages.concat(cartExperiences);
    return res.status(200).send(cartPackagesAndExperiences);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/experiences", async (req, res) => {
  const { userId } = req.query;
  const { experienceId, pax, price, dates } = req.body;

  if (!experienceId || !userId || !pax || !dates)
    return res
      .status(201)
      .send("You must enter a experienceId, pax, total, date and userId");
  try {
    let searchedCart = await Reservation_experience.findAll({
      where: {
        [Op.and]: [
          { userId: userId },
          { experienceId: experienceId },
          { status: "cart" },
        ],
      },
    });

    if (searchedCart.length > 0) {
      Reservation_experience.update(
        {
          dates: dates,
          passengers: pax,
          total: parseInt(pax) * parseInt(price),
          status: "cart",
        },
        {
          where: {
            [Op.and]: [
              { userId: userId },
              { experienceId: experienceId },
              { status: "cart" },
            ],
          },
        }
      );
      return res.status(201).send("Cart added successfully");
    } else {
      let newExperiencesCart = await Reservation_experience.create({
        dates: dates,
        passengers: pax,
        total: parseInt(pax) * parseInt(price),
        status: "cart",
        experienceId,
        userId,
      });
      return res.status(201).json(newExperiencesCart);
    }
  } catch (err) {
    // return res.status(404).send("There was an error in the creation of the city");
    res.status(404).json({ error: err.message });
  }
});

router.post("/packages", async (req, res) => {
  const { userId } = req.query;
  const { packageId, pax, price, dates } = req.body;

  if (!packageId || !userId || !pax || !dates)
    return res
      .status(201)
      .send("You must enter a packageId, pax, total, date and userId");
  try {
    let searchedCart = await Reservation_package.findAll({
      where: {
        [Op.and]: [
          { userId: userId },
          { packageId: packageId },
          { status: "cart" },
        ],
      },
    });

    if (searchedCart.length > 0) {
      Reservation_package.update(
        {
          dates: dates,
          passengers: pax,
          total: parseInt(pax) * parseInt(price),
          status: "cart",
        },
        {
          where: {
            [Op.and]: [
              { userId: userId },
              { packageId: packageId },
              { status: "cart" },
            ],
          },
        }
      );
      return res.status(201).send("Cart added successfully");
    } else {
      let newPackageCart = await Reservation_package.create({
        dates: dates,
        passengers: pax,
        total: parseInt(pax) * parseInt(price),
        status: "cart",
        packageId,
        userId,
      });
      return res.status(201).json(newPackageCart);
    }
  } catch (err) {
    // return res.status(404).send("There was an error in the creation of the city");
    res.status(404).json({ error: err.message });
  }
});

router.put("/experiences", async (req, res) => {
  const { experienceId, userId, status, bought } = req.body;
  try {
    Reservation_experience.update(
      { bought: bought, status: status },
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
  const { packageId, userId, status, bought } = req.body;
  try {
    Reservation_package.update(
      { bought: bought, status: status },
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

router.delete("/packages/:Id", async (req, res) => {
  const { Id } = req.params;
  try {
    await Reservation_package.destroy({ where: { id: Id } });
    res.status(200).send("Package deleted successfully");
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

router.delete("/experiences/:Id", async (req, res) => {
  const { Id } = req.params;
  try {
    await Reservation_experience.destroy({ where: { id: Id } });
    res.status(200).send("Experience deleted successfully");
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

router.delete("/packages", async (req, res) => {
  try {
    const boughtPackages = await Reservation_package.findAll();
    boughtPackages.forEach((element) => {
      Reservation_package.destroy({ where: { id: element.id } });
    });

    res.status(200).send("Packages deleted successfully");
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

router.delete("/experiences", async (req, res) => {
  try {
    const boughtExperiences = await Reservation_experience.findAll();
    boughtExperiences.forEach((element) => {
      Reservation_experience.destroy({ where: { id: element.id } });
    });

    res.status(200).send("Experiences deleted successfully");
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

module.exports = router;

const { Router } = require("express");
const {
  Sale_package,
  Sale_experience,
  Sale,
  Experience,
  Package,
  User,
} = require("../database");
const { Op } = require("sequelize");

const router = Router();

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const userCart = await Sale.findAll({
      where: {
        [Op.and]: [{ userId: userId }, { status: "cart" }],
      },
      include: [Experience, Package],
    });

    if (userCart.length > 0) {
      const cartExperiences = await userCart[0].experiences.map((e) => {
        return e.sale_experience;
      });
      const cartPackages = await userCart[0].packages.map((e) => {
        return e.sale_package;
      });
      const allCartItems = cartPackages.concat(cartExperiences);
      return res.status(200).send(allCartItems);
    } else {
      return res.status(200).send("There is no cart to this user");
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const allSales = await Sale.findAll({
      include: [Package, Experience, User],
    });
    let allCart = allSales.filter((s) => s.status === "cart");
    return res.status(200).send(allCart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  const { userId } = req.query;
  const arrayItems = req.body;

  try {
    // Busco el cart anterior de este usuario
    const allSales = await Sale.findAll({
      where: {
        [Op.and]: [{ userId: userId }, { status: "cart" }],
      },
      include: [Experience, Package],
    });

    //Elimino sus paquetes y experiencias asociados
    allSales.forEach((s) => {
      Sale_experience.destroy({ where: { saleId: s.id } });
      Sale_package.destroy({ where: { saleId: s.id } });
    });

    //Elimino el cart
    await Sale.destroy({
      where: {
        [Op.and]: [{ userId: userId }, { status: "cart" }],
      },
    });

    //Creo un nuevo cart
    let total = 0;
    arrayItems.forEach((i) => {
      total = total + parseInt(i.pax) * parseInt(i.price);
    });

    let newSale = await Sale.create({
      total: Number(total),
      status: "cart",
      userId: userId,
    });

    // Recorro el array de items y creo la asociacion de cada exp o pack
    // con en nuevo cart
    arrayItems.forEach((i) => {
      if (i.type === "experience") {
        Sale_experience.create({
          dates: i.dates,
          price: parseInt(i.price),
          passengers: parseInt(i.pax),
          total: parseInt(i.pax) * parseInt(i.price),
          saleId: newSale.id,
          experienceId: i.experienceId,
        });
      } else if (i.type === "package") {
        Sale_package.create({
          dates: i.dates,
          price: parseInt(i.price),
          passengers: parseInt(i.pax),
          total: parseInt(i.pax) * parseInt(i.price),
          saleId: newSale.id,
          packageId: i.packageId,
        });
      }
    });

    return res.status(201).json(newSale);
  } catch (err) {
    console.log(err);
    res.status(404).json({ error: err.message });
  }
});

module.exports = router;

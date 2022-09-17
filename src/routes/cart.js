const { Router } = require("express");
const {
  Sales_package,
  Sales_experience,
  Sales,
  User,
  Experience,
  Package,
} = require("../database");
const { Op } = require("sequelize");

const router = Router();

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const allSales = await Sales.findAll({
      where: {
        userId: userId,
      },
      include: [Experience, Package],
    });
    let allCart = allSales.filter((s) => s.status === "cart");
    return res.status(200).send(allCart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const allSales = await Sales.findAll({
      include: [Package, Experience],
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
    const allSales = await Sales.findAll({
      where: {
        [Op.and]: [{ userId: userId }, { status: "cart" }],
      },
      include: [Experience, Package],
    });

    //Elimino sus paquetes y experiencias asociados
    allSales.forEach((s) => {
      Sales_experience.destroy({ where: { salesId: s.id } });
      Sales_package.destroy({ where: { salesId: s.id } });
    });

    //Elimino el cart
    Sales.destroy({
      where: {
        [Op.and]: [{ userId: userId }, { status: "cart" }],
      },
    });

    //Creo un nuevo cart
    let total;
    arrayItems.forEach((i) => {
      total = total + i.pax * i.price;
    });

    let newSale = await Sales.create({
      total: parseInt(pax) * parseInt(price),
      status: "cart",
      userId: userId,
    });

    // Recorro el array de items y creo la asociacion de cada exp o pack
    // con en nuevo cart
    arrayItems.forEach((i) => {
      if (i.tipe === "experience") {
        Sales_experience.create({
          dates: i.dates,
          passengers: i.pax,
          total: parseInt(i.pax) * parseInt(i.price),
          saleId: newSale.id,
          userId: userId,
        });
      } else if (i.tipe === "package") {
        Sales_package.create({
          dates: i.dates,
          passengers: i.pax,
          total: parseInt(i.pax) * parseInt(i.price),
          saleId: newSale.id,
          userId: userId,
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

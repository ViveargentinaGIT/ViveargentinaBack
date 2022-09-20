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
const { transporter, authenticateToken } = require("../utils/utils");

const router = Router();

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const allSales = await Sale.findAll({
      where: {
        userId: userId,
      },
      include: [Experience, Package, User],
    });
    let allHistorySales = allSales.filter((s) => s.status !== "cart");
    return res.status(200).send(allHistorySales);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const allSales = await Sale.findAll({
      include: [Package, Experience, User],
    });
    let allHistorySales = allSales.filter((s) => s.status !== "cart");
    return res.status(200).send(allHistorySales);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  const { userId } = req.query;
  const arrayItems = req.body;

  try {
    // Busco el cart anterior de este usuario
    const allSalesCart = await Sale.findAll({
      where: {
        [Op.and]: [{ userId: userId }, { status: "cart" }],
      },
      include: [Experience, Package],
    });

    //Elimino sus paquetes y experiencias asociados
    allSalesCart.forEach((s) => {
      Sale_experience.destroy({ where: { saleId: s.id } });
      Sale_package.destroy({ where: { saleId: s.id } });
    });

    //Elimino el cart
    await Sale.destroy({
      where: {
        [Op.and]: [{ userId: userId }, { status: "cart" }],
      },
    });

    // Busco el pago pendiente anterior de este usuario
    const allSalesPending = await Sale.findAll({
      where: {
        [Op.and]: [{ userId: userId }, { status: "Pending payment" }],
      },
      include: [Experience, Package],
    });

    //Elimino sus paquetes y experiencias asociados
    allSalesPending.forEach((s) => {
      Sale_experience.destroy({ where: { saleId: s.id } });
      Sale_package.destroy({ where: { saleId: s.id } });
    });

    //Elimino el pago pendiente anterior
    await Sale.destroy({
      where: {
        [Op.and]: [{ userId: userId }, { status: "Pending payment" }],
      },
    });

    //Creo un nuevo cart
    let total = 0;
    arrayItems.forEach((i) => {
      total = total + parseInt(i.pax) * parseInt(i.price);
    });

    let newSale = await Sale.create({
      total: Number(total),
      status: "Pending payment",
      userId: userId,
    });

    // Recorro el array de items y creo la asociacion de cada exp o pack
    // con en nuevo cart
    arrayItems.forEach((i) => {
      if (i.type === "experience") {
        Sale_experience.create({
          name: i.name,
          image: i.image,
          dates: i.dates,
          price: parseInt(i.price),
          pax: parseInt(i.pax),
          total: parseInt(i.pax) * parseInt(i.price),
          saleId: newSale.id,
          experienceId: i.experienceId,
        });
      } else if (i.type === "package") {
        Sale_package.create({
          name: i.name,
          image: i.image,
          dates: i.dates,
          price: parseInt(i.price),
          pax: parseInt(i.pax),
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

router.put("/", async (req, res) => {
  const { saleId, status } = req.body;
  if (!saleId || !status)
    return res.status(201).send("SaleId and status are required");
  try {
    Sale.update(
      { status: status },
      {
        where: { id: saleId },
      }
    );
    return res.status(201).send("Sale updated successfully");
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

router.put("/approved", authenticateToken, async (req, res) => {
  const userId = req.id;
  const { status } = req.body;
  console.log(userId);
  console.log(userId);
  if (!userId || !status)
    return res.status(201).send("UserId and status are required");
  try {
    Sale.update(
      { status: status },
      {
        where: {
          [Op.and]: [{ userId: userId }, { status: "Pending payment" }],
        },
      }
    );
    return res.status(201).send("Sale updated successfully");
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

router.delete("/:saleId", async (req, res) => {
  const { saleId } = req.params;
  try {
    const allSales = await Sale.findAll({
      where: { id: saleId },
      include: [Experience, Package],
    });

    //Elimino sus paquetes y experiencias asociados
    allSales.forEach((s) => {
      Sale_experience.destroy({ where: { saleId: s.id } });
      Sale_package.destroy({ where: { saleId: s.id } });
    });

    //Elimino el cart
    Sale.destroy({ where: { id: saleId } });
    return res.status(201).send("Sale deleted successfully");
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

module.exports = router;

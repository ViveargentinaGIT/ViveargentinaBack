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
    console.log("saleId ", newSale.id);
    return res.status(201).json(newSale.id);
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
  const { status, saleId } = req.body;

  console.log(userId);
  console.log(status);

  if (!userId || !status)
    return res.status(201).send("UserId and status are required");
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

    const selectedSale = await Sale.findAll({
      where: {
        id: saleId,
      },
      include: [Experience, Package, User],
    });

    let total = selectedSale[0].total;
    let first_name = selectedSale[0].user.first_name;
    let email = selectedSale[0].user.email;

    let experiences = selectedSale[0].experiences;
    let packages = selectedSale[0].packages;

    let experienceString = experiences.map((e) => {
      return (
        e.name +
        " - " +
        e.sale_experience.pax +
        " Passengers" +
        " - " +
        e.sale_experience.dates
      );
    });

    let packageString = packages.map((e) => {
      return (
        e.name +
        " - " +
        e.sale_package.pax +
        "Passengers" +
        " - " +
        e.sale_package.dates
      );
    });

    await transporter.sendMail({
      from: '"Viveargentina" <vaviveargentina@gmail.com>', // sender address
      to: email, // list of receivers
      subject: `Viveargentina purchase ${
        status === "approved" ? "confirmation" : "rejected"
      }`, // Subject line
      html: `<h1>ExperianceViveArgentina! purchase ${
        status === "approved" ? "confirmation" : "rejected"
      }</h1>
      <p>${first_name} your purchase for Ars $${total} was ${
        status === "approved" ? "confirmed" : "rejected"
      }.</p>
      <p>Items included:</p>
      ${experienceString.map((e) => {
        return `<p>${e}</p>`;
      })}
      ${packageString.map((e) => {
        return `<p>${e}</p>`;
      })}
      
      `, // html body
    });

    //rejected   // approved     //confirmed  // canceled
    Sale.update(
      { status: status === "approved" ? "confirmed" : "canceled" },
      {
        where: {
          id: saleId,
        },
      }
    );

    return res
      .status(201)
      .send(
        `${
          status === "approved"
            ? "Time to travel!"
            : "Payment rejected, try again."
        }`
      );
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

router.delete("/", async (req, res) => {
  try {
    const allSales = await Sale.findAll({
      include: [Experience, Package],
    });

    //Elimino sus paquetes y experiencias asociados
    allSales.forEach((s) => {
      Sale_experience.destroy({ where: { saleId: s.id } });
      Sale_package.destroy({ where: { saleId: s.id } });
      Sale.destroy({ where: { id: s.id } });
    });

    return res.status(201).send("Sales deleted successfully");
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

router.get("/cancelation/", async (req, res) => {
  const { userId } = req.query;
  const { saleId } = req.query;
  try {
    await transporter.sendMail({
      from: '"Viveargentina" <vaviveargentina@gmail.com>', // sender address
      to: '"Viveargentina" <vaviveargentina@gmail.com>', // list of receivers
      subject: "Viveargentina solicitude of cancelation", // Subject line
      html: `<h1>Viveargentina solicitude of cancelation</h1>
      <p>The user with the id= ${userId} is requesting to cancel the sale with the id= ${saleId}.</p>
      `, // html body
    });
    return res
      .status(200)
      .send("Solicitude of cancelation received successfully ");
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

const { Router } = require("express");

//const { Category, Experience } = require("../database");

// SDK de Mercado Pago
const mercadopago = require("mercadopago");
// Agrega credenciales
mercadopago.configure({
  access_token:
    "APP_USR-2560253671093448-090817-27d513159a620a6265f7085c340415d6-1194840361",
});

const router = Router();

router.get("/", async (req, res) => {
  try {
    return res.status(200).send("MeradoPago");
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  const arrayItems = req.body;
  const arrayPreference = arrayItems.map((i) => {
    return {
      title: i.name,
      unit_price: parseInt(i.price),
      quantity: parseInt(i.pax),
    };
  });
  console.log(arrayPreference);

  let preference = {
    items: arrayPreference,
    back_urls: {
      success: "http://localhost:3000/home",
      failure: "http://localhost:3000/home",
      pending: "http://localhost:3000/home",
    },
    auto_return: "approved",
  };

  mercadopago.preferences
    .create(preference)
    .then(function (response) {
      console.log(response.body);
      res.status(200).send(response.body.id);
    })
    .catch(function (error) {
      console.log(error);
    });
});

router.post("/response", async (req, res) => {
  try {
    console.log(req.body);
    return res.status(200).send("OK");
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

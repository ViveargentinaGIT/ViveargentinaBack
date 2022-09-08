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
  const { pax, date, price, name } = req.body;
  let preference = {
    items: [
      {
        title: name,
        unit_price: price,
        quantity: pax,
      },
    ],
  };

  mercadopago.preferences
    .create(preference)
    .then(function (response) {
      console.log(response.body);
      res.redirect(response.body.init_point);
    })
    .catch(function (error) {
      console.log(error);
    });
});

module.exports = router;

const { Router } = require("express");
const axios = require("axios");
const {
  Administrator,
  Category,
  Experience,
  Package,
  Provider,
  Province,
  Query,
  Region,
  Reservation,
  Review,
  User,
} = require("../database");

const router = Router();

// Busco todas las regiones en la DB
router.get("/regions", async (req, res) => {
  try {
    const regions = await Region.findAll();

    if (regions.length > 0) return res.status(200).send(regions);
    else {
      return res.status(201).send("No hay regiones cargadas");
    }
  } catch (err) {
    console.log(err);
    res.status(400).send("Hubo un problema con la busqueda");
  }
});

// Agrego una region a la DB
router.post("/regions", async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(201).send("Debe ingresar un nombre");
  } else {
    try {
      const newRegion = await Pokemon.create({
        name: name.toLowerCase(),
      });
      return res.status(201).json(newRegion);
    } catch (err) {
      console.log(err);
      return res.status(404).send("Error en la creación del nuevo Pokemon");
    }
  }
});

module.exports = router;

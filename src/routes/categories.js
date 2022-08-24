const { Router } = require("express");
const { Category, Experience } = require("../database");

const router = Router();

router.get("/", async (req, res) => {
    try {
      const categories = await Category.findAll({include: Experience});
      if (categories.length > 0) return res.status(200).send(categories);
      else {
        return res.status(201).send("No hay categorías cargadas");
      }
    } catch (err) {
      console.log(err);
      res.status(400).send("Hubo un problema con la busqueda");
    }
  });
  
  router.post("/", async (req, res) => {
    const {name} = req.body;
    if (!name) {
      return res.status(201).send("Debe ingresar un nombre");
    } else {
      try {
        const newCategory = await Category.create({
          name: name.toLowerCase(),
        });
        return res.status(201).json(newCategory);
      } catch (err) {
        console.log(err);
        return res.status(404).send("Error en la creación de la categoría");
      }
    }
  });





module.exports = router;

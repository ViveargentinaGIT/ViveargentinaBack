const { Router } = require("express");
const { Administrator } = require("../database");

const router = Router();

router.get('/', async (req, res) => {
    try {
        const administrators = await Administrator.findAll();
        if (administrators.length > 0) return res.status(200).send(administrators);
        else {
          return res.status(201).send("No hay administradores cargados");
        }
      } catch (err) {
        console.log(err);
        res.status(400).send("Hubo un problema con la busqueda");
      }
})

router.post('/', async (req, res) => {
    const {name, email, password} = req.body;
    try {
        const administrator = await Administrator.create({name, email, password});
        res.status(201).json(administrator)
    } catch (e) {
        res.status(400).json({error: e.message})
    }
})


module.exports = router;

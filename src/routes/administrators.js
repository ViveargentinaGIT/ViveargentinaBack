const { Router } = require("express");
const { Administrator } = require("../database");

const router = Router();

router.get("/", async (req, res) => {
  try {
    const administrators = await Administrator.findAll();
    return res.status(200).send(administrators);
  } catch (err) {
    res.status(400).json({error: err.message});
  }
});

router.post("/", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(201).send("You must enter a name, email and password to create a new administrator");
  try {
    const newAdministrator = await Administrator.create({name, email, password,});
    res.status(201).json(newAdministrator);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.delete('/:adminId', async (req, res) => {
  const {adminId} = req.params;
  try {
    await Administrator.destroy({where: {id: adminId}});
    res.status(200).send('Administrator deleted successfully')
  } catch (err) {
    res.status(404).json({error: err.message});
  }
});

module.exports = router;

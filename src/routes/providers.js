const { Router } = require("express");
const { Provider, Experience } = require("../database");
const { Op } = require('sequelize');

const router = Router();

router.get("/", async (req, res) => {
  const {name} = req.query;
  try {
    if(name) {
      let searchedProvider = await Provider.findAll({where: {
        [Op.or]: [
          {name: {[Op.substring]: name}},
          {name: {[Op.substring]: name[0].toUpperCase() + name.slice(1)}},
          {name: name[0].toUpperCase() + name.slice(1)}
        ]}}, {include: Experience})
        searchedProvider.length > 0 ?
        res.status(201).json(searchedProvider) :
        res.status(404).send('Provider not found');
    } else {
      const providers = await Provider.findAll({include: Experience});
      return res.status(200).send(providers);
    }
  } catch (err) {
    res.status(400).json({error: err.message});
  }
});

router.post("/", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(201).send("You must enter a name, email and password to create a new provider");
  try {
    const newProvider = await Provider.create({name, email, password});
    return res.status(201).json(newProvider);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.delete('/:providerId', async (req, res) => {
  const {providerId} = req.params;
  try {
    await Provider.destroy({where: {id: providerId}});
    res.status(200).send('Provider deleted successfully');
  } catch (err) {
    res.status(404).json({error: err.message});
  }
});

router.put('/', async (req, res) => {
  const {providerId} = req.query;
  const { name, email, password } = req.body;
  try {
    Provider.update({name, email, password}, {where: {id: providerId}});
    res.status(200).send('Provider updated successfully');
  } catch (err) {
    res.status(404).json({error: err.message});
  }
});

module.exports = router;

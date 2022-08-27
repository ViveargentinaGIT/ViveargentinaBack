const { Router } = require("express");
const { Region, City } = require("../database");

const router = Router();

router.get("/", async (req, res) => {
  try {
    const allRegions = await Region.findAll({include: City});
    return res.status(200).json(allRegions);
  } catch (err) {
    res.status(400).json({error: err.message});
  }
});

router.get("/:regionId", async (req, res) => {
  const { regionId } = req.params;
  try {
    const selectedRegion = await Region.findByPk(regionId, {include: City});
    return res.status(200).send(selectedRegion);
  } catch (err) {
    res.status(400).json({error: err.message});
  }
});

router.post("/", async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(404).send("You must enter a name to create a new region");
  try {
    const newRegion = await Region.create({name});
    return res.status(201).json(newRegion);
  } catch (err) {
    return res.status(404).json({error: err.message});
  }
});

router.delete('/:regionId', async (req, res) => {
  const {regionId} = req.params;
  try {
    await Region.destroy({where: {id: regionId}});
    res.status(200).send('Region deleted successfully');
  } catch (err) {
    res.status(404).json({error: err.message});
  }
});

router.put('/', async (req, res) => {
  const { regionId } = req.query;
  const { name } = req.body;
  try {
    Region.update({name}, {where: {id: regionId}});
    res.status(200).send('Region updated successfully');
  } catch (err) {
    res.status(404).json({error: err.message});
  }
});

module.exports = router;

const { Router } = require("express");
const { Region, Cities } = require("../database");

const router = Router();

router.get("/", async (req, res) => {
  try {
    const regions = await Region.findAll({ include: Cities });

    if (regions.length > 0) return res.status(200).send(regions);
    else {
      return res.status(201).send("There are no regions yet");
    }
  } catch (err) {
    console.log(err);
    res.status(400).send("An error ocurred while searching for the regions");
  }
});

router.get("/:regionID", async (req, res) => {
  try {
    const { regionID } = req.params;
    const selectedRegion = await Region.findByPk(regionID, { include: Cities });
    if (selectedRegion) return res.status(200).send(selectedRegion);
    else {
      return res.status(201).send("There are no region with this ID");
    }
  } catch (err) {
    console.log(err);
    res.status(400).send("An error ocurred while searching for the region");
  }
});

router.post("/", async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res
      .status(201)
      .send("You must enter a name to create the new region");
  } else {
    try {
      const newRegion = await Region.create({
        name: name.toLowerCase(),
      });
      return res.status(201).json(newRegion);
    } catch (err) {
      console.log(err);
      return res
        .status(404)
        .send("An error ocurred in the creation of the region");
    }
  }
});

module.exports = router;

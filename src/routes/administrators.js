const { Router } = require("express");
const { Administrator } = require("../database");

const router = Router();

router.get("/", async (req, res) => {
  try {
    const administrators = await Administrator.findAll();
    if (administrators.length > 0) return res.status(200).send(administrators);
    else {
      return res.status(201).send("There are no administrators yet");
    }
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .send("An error ocurred while searching for the administrators");
  }
});

router.post("/", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(201)
      .send(
        "You must enter a name, email and password to create the new administrator"
      );
  } else {
    try {
      const administrator = await Administrator.create({
        name,
        email,
        password,
      });
      res.status(201).json(administrator);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  }
});

module.exports = router;

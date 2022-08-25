const { Router } = require("express");
const { Provider } = require("../database");

const router = Router();

router.get("/", async (req, res) => {
  try {
    const providers = await Provider.findAll();
    if (providers.length > 0) return res.status(200).send(providers);
    else {
      return res.status(201).send("There are no providers yet");
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
        "You must enter a name, email and password to create the new provider"
      );
  } else {
    try {
      const newProvider = await Provider.create({
        name,
        email,
        password,
      });

      res.status(201).json(newProvider);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  }
});

module.exports = router;

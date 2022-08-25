const { Router } = require("express");
const { User, Query, Review } = require("../database");

const router = Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.findAll({
      include: Query,
      Review,
    });
    if (users.length > 0) return res.status(200).send(users);
    else {
      return res.status(201).send("There are no users yet");
    }
  } catch (err) {
    console.log(err);
    res.status(400).send("An error ocurred while searching for the users");
  }
});

router.post("/", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(201)
      .send("You must enter a name, email and password to create the new user");
  } else {
    try {
      const newUser = await User.create({
        name,
        email,
        password,
      });
      res.status(201).json(newUser);
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  }
});

module.exports = router;

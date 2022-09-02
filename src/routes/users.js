const { Router } = require("express");
const { User, Query, Review, Experience, Package } = require("../database");

const router = Router();

router.get("/administrators", async (req, res) => {
  try {
    const allUsers = await User.findAll({
      where: { administrator: true },
    });
    return res.status(200).send(allUsers);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/providers", async (req, res) => {
  try {
    const allUsers = await User.findAll({
      include: { model: Experience },
      where: { provider: true },
    });
    return res.status(200).send(allUsers);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const selectedUser = await User.findByPk(userId, {
      include: [Query, Review, Experience, Package],
    });
    return res.status(200).send(selectedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const allUsers = await User.findAll({
      include: [Query, Review, Experience, Package],
    });
    return res.status(200).send(allUsers);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  const { first_name, last_name, email, password, birth_date, photo } =
    req.body;
  if (!first_name)
    return res
      .status(404)
      .send("You must enter a name, email and password to create a new user");
  try {
    const newUser = await User.create({
      first_name,
      last_name,
      email,
      password,
      birth_date,
      photo,
    });
    return res.status(201).json(newUser);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.delete("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    await User.destroy({ where: { id: userId } });
    res.status(200).send("User deleted successfully");
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

router.put("/:userId", async (req, res) => {
  const { userId } = req.params;
  const {
    first_name,
    last_name,
    email,
    password,
    birth_date,
    photo,
    administrator,
    provider,
    provider_requested,
    disabled,
  } = req.body;
  try {
    User.update(
      {
        first_name,
        last_name,
        email,
        password,
        birth_date,
        photo,
        administrator,
        provider,
        provider_requested,
        disabled,
      },
      { where: { id: userId } }
    );
    res.status(200).send("User updated successfully");
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

module.exports = router;

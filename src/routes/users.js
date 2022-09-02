const { Router } = require("express");
const { User, Query, Review } = require("../database");

const router = Router();

router.get("/", async (req, res) => {
  try {
    const allUsers = await User.findAll({ include: [Query, Review] });
    return res.status(200).send(allUsers);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  const { first_name, email, password } = req.body;
  if (!first_name)
    return res
      .status(404)
      .send("You must enter a name, email and password to create a new user");
  try {
    const newUser = await User.create({ first_name, email, password });
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

router.put("/", async (req, res) => {
  const { userId } = req.query;
  const { name, email, password } = req.body;
  try {
    User.update({ name, email, password }, { where: { id: userId } });
    res.status(200).send("User updated successfully");
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

module.exports = router;

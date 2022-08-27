const { Router } = require("express");
const { Query, User } = require("../database");

const router = Router();

router.get("/", async (req, res) => {
  try {
    const allQueries = await Query.findAll({include: User});
    return res.status(200).send(allQueries);
  } catch (err) {
    res.status(400).json({error: err.message});
  }
});

router.post("/", async (req, res) => {
  const { text, date, userId } = req.body;
  if (!text || !date) return res.status(201).send("You must enter a text and date");
  try {
    const newQuery = await Query.create({text, date});
    const selectedUser = await User.findByPk(userId);
    newQuery.setUser(selectedUser);
    return res.status(201).json(newQuery);
  } catch (err) {
    return res.status(404).json({error: err.message});
  }
});

router.delete('/:queryId', async (req, res) => {
  const {queryId} = req.params;
  try {
    await Query.destroy({where: {id: queryId}});
    res.status(200).send('Query deleted successfully');
  } catch (err) {
    res.status(404).json({error: err.message});
  }
});

module.exports = router;

const { Router } = require("express");
const { Query, User } = require("../database");

const router = Router();

router.get("/", async (req, res) => {
  try {
    const queries = await Query.findAll({
      include: User,
    });
    if (queries.length > 0) return res.status(200).send(queries);
    else {
      return res.status(201).send("There are no queries yet");
    }
  } catch (err) {
    console.log(err);
    res.status(400).send("There was a problem with your search");
  }
});

router.post("/", async (req, res) => {
  const { text, date, userId } = req.body;
  if (!text || !date) {
    return res.status(201).send("You must enter a text and date");
  } else {
    try {
      const newQuery = await Query.create({
        text,
        date,
      });

      const selectedUser = await User.findByPk(userId);
      newQuery.addUser(selectedUser);

      return res.status(201).json(newQuery);
    } catch (err) {
      console.log(err);
      return res
        .status(404)
        .send("There was an error in the creation of the query");
    }
  }
});

module.exports = router;

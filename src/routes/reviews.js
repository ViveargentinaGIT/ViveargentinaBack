const { Router } = require("express");
const { Review, User } = require("../database");

const router = Router();

router.get("/", async (req, res) => {
  try {
    const reviews = await Review.findAll({
      include: User,
    });
    if (reviews.length > 0) return res.status(200).send(reviews);
    else {
      return res.status(201).send("There are no reviews yet");
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
      const newReview = await Review.create({
        text,
        date,
      });

      const selectedUser = await User.findByPk(userId);
      newReview.addUser(selectedUser);

      return res.status(201).json(newReview);
    } catch (err) {
      console.log(err);
      return res
        .status(404)
        .send("There was an error in the creation of the experience");
    }
  }
});

module.exports = router;

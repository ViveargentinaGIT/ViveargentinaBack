const { Router } = require("express");
const { Review, User } = require("../database");

const router = Router();

router.get("/", async (req, res) => {
  try {
    const allReviews = await Review.findAll({include: User});
    return res.status(200).send(allReviews);
  } catch (err) {
    res.status(400).json({error: err.message});
  }
}); 

router.post("/", async (req, res) => {
  const { text, date, userId } = req.body;
  if (!text || !date) return res.status(404).send("You must enter a text and date");
  try {
    const newReview = await Review.create({text, date});
    const selectedUser = await User.findByPk(userId);
    newReview.setUser(selectedUser);
    return res.status(201).json(newReview);
  } catch (err) {
    return res.status(404).json({error: err.message});
  }
});

router.delete('/:reviewId', async (req, res) => {
  const {reviewId} = req.params;
  try {
    await Review.destroy({where: {id: reviewId}});
    res.status(200).send('Review deleted successfully');
  } catch (err) {
    res.status(404).json({error: err.message});
  }
});

module.exports = router;

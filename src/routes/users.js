const { Router } = require("express");
const { User, Query, Review, Experience, Package } = require("../database");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const router = Router();

function authenticateToken(req, res, next){
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if(token == null) return res.sendStatus(401)

  jwt.verify(token, "henryboom", (err, user)=>{
    if(err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

router.post("/google_login", async (req, res)=>{
  const {first_name, last_name, email, password, photo} = req.body;
  try {
    const user = await User.findAll({
      where:{
        email: email
      },
      include: [Query, Review, Experience, Package]
    })
    if(user.length===0){
      await User.create({
        first_name,
        last_name,
        email,
        password,
        photo
      });
      const newUser = await User.findAll({
        where:{
          email: email
        },
        include: [Query, Review, Experience, Package]
      })
      const id = newUser[0].id
			const accessToken = jwt.sign(id, "henryboom")
      return res.status(201).json({accessToken: accessToken, auth: true, user: newUser[0]})
    }else{
      const id = user[0].id
			const accessToken = jwt.sign(id, "henryboom")
      res.status(201).json({accessToken: accessToken, auth: true, user: user[0]})
      return res.status(201).json(user[0]);
    }
  } catch (error) {
    res.status(401).send('something went wrong')
  }
})

router.post("/singin", async (req, res)=>{
  const {first_name, last_name, email, password} = req.body;
  if (!first_name){
    return res.status(404).send("You must enter a name, email and password to create a new user");
  }
  try {
    const user = await User.findAll({
      where:{
        email: email
      }
    })
    if(user.length>0)return res.status(400).send('There is already an user registered with this mail')
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await User.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
    });
    return res.status(201).json(newUser);
  } catch (error) {
    res.status(500).send('error')
  }
})

router.post("/login", async (req, res)=>{
  const {email, password}= req.body;
  try {
    let user = await User.findAll({
      where:{
        email: email
      },
      include: [Query, Review, Experience, Package]
    })
    user = user[0].dataValues
    if(user.length === 0){
      res.status(404).send('user not found')
    }
    if(await bcrypt.compare(password, user.password)){
      const id = user.id
			const accessToken = jwt.sign(id, "henryboom")
      user.password = password;
      res.status(201).json({accessToken: accessToken, auth: true, user: user})
		} else{
			res.send('not allowed')
		}
  } catch (error) {
    res.status(500).send('something went wrong')
  }
})

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

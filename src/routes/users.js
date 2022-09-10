const { Router } = require("express");
const { User, Query, Review, Experience, Package } = require("../database");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { transporter } = require("../utils/utils");

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
  let googleEmail = `google@${email}`
  try {
    const user = await User.findAll({
      where:{
        email: googleEmail
      },
      include: [Query, Review, Experience, Package]
    })
    if(user.length===0){
      await User.create({
        first_name,
        last_name,
        email: googleEmail,
        password,
        photo
      });
      const newUser = await User.findAll({
        where:{
          email: googleEmail
        },
        include: [Query, Review, Experience, Package]
      })
      newUser.email = email;
      const id = newUser[0].id
			const accessToken = await jwt.sign(id, "henryboom")
      return res.status(201).json({accessToken: accessToken, auth: true, user: newUser[0]})
    }else{
      const id = user[0].id
      user[0].email = email
			const accessToken = await jwt.sign(id, "henryboom")
      return res.status(201).json({accessToken: accessToken, auth: true, user: user[0]})
    }
  } catch (error) {
    return res.status(401).send('something went wrong')
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
    const accessToken = await jwt.sign(newUser.id, "henryboom")
    await transporter.sendMail({
      from: '"Viveargentina" <vaviveargentina@gmail.com>', // sender address
      to: newUser.email, // list of receivers
      subject: "Viveargentina email confirmation", // Subject line
      html: `<h1>ExperianceViveArgentina! confirmation email</h1>
            <p>If you have not register to experienceviveargentina please ignore this email</p>
            <p>Click the link below to complete the registration</p>
            <buttom><a href="https://experienceviveargentina.vercel.app/verify/${newUser.id}/${accessToken}">Confirm Registration</a></buttom>
            <p>${accessToken}</p>`, // html body
    })
    res.status(200).send(`An email was send to ${newUser.email}. Check the email to complete the registration`)
  } catch (error) {
    res.status(500).send('error')
  }
})

router.post("/verify/:id", authenticateToken, async (req, res)=>{
  console.log("id: "+req.params.id)
  User.update(
    {
      birth_date: "active",
    },
    { where: { id: req.params.id } }
  );
  res.redirect('https://experienceviveargentina.vercel.app/home')
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
    if(user[0].birth_date === null){
      res.status(400).send('Please confirm your email to login')
    }
    if(await bcrypt.compare(password, user.password)){
      const id = user.id
			const accessToken = await jwt.sign(id, "henryboom")
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

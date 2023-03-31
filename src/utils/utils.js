const { Router } = require("express");
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
// const axios = require("axios");
// // const { Adminsitrator } = require("../models/Administrator");
// const { Category } = require("../models/Category");
// const { Experience } = require("../models/Experience");
// const { Package } = require("../models/Package");
// // const { Provider } = require("../models/Provider");
// // const { City } = require("../models/Province");
// const { Query } = require("../models/Query");
// const { Region } = require("../models/Region");
// const { Reservation } = require("../models/Reservation");
// const { Review } = require("../models/Review");
// const { User } = require("../models/User");

function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.sendStatus(401)
    jwt.verify(token, "henryboom", (err, id)=>{
        if(err) return res.sendStatus(403)
        req.id = id
        console.log(id)
        next()
    })
}

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "vaviveargentina@gmail.com", // generated ethereal user
      pass: "cdxlgihrzldqggjz", // generated ethereal password
    },
});

transporter.verify().then(()=>{
    console.log("ready to send emails");
}).catch(()=>{
    console.log("email is not working")
})

// verify connection configuration
// transporter.verify(function (error, success) {
//     if (error) {
//       console.log(error);
//     } else {
//       console.log("Server is ready to take our messages");
//     }
//   });
  

module.exports = {
    authenticateToken,
    transporter
}
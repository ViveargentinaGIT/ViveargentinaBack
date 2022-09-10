const { Router } = require("express");
const { transporter } = require("../utils/utils");

const router = Router();

router.post("/", async (req,res)=>{
      const {name, lastName, email, message} = req.body;
      await transporter.sendMail({
            from: '"Viveargentina" <vaviveargentina@gmail.com>', // sender address
            to: "vaviveargentina@gmail.com", // list of receivers
            subject: "Viveargentina ContactUs email", // Subject line
            html: `<h1>ContactUs email</h1>
                  <p>From: ${name} ${lastName}</p>
                  <p>Email: ${email}</p>
                  <p>Message: ${message}</p>`, // html body
      })
      res.send('email sent successfuly')
})


module.exports = router;

const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const mysql =require('mysql2')
const db=mysql.createConnection({
  host : process.env.host,
  user :  process.env.user,
  password :  process.env.password,
  database :  process.env.database,
  port:3307
});

// const auth = require("../middlewares/auth");


router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  // check all the missing fields.
  if (!name || !email || !password)
    return res
      .status(400)
      .json({ error: `Please enter all the required field.` });

  // name validation.
  if (name.length > 25)
    return res
      .status(400)
      .json({ error: "name can only be less than 25 characters" });

  // email validation.
  const emailReg =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!emailReg.test(email))
    return res
      .status(400)
      .json({ error: "please enter a valid email address." });

  // validation of password.
  if (password.length < 6)
    return res
      .status(400)
      .json({ error: "password must be atleast 6 characters long" });
  try {
   
    const q_searchemail="SELECT * FROM auth WHERE email = ?";
    db.query(q_searchemail,[email],async (err,result)=>
    {
      if(result.length)
      {
        res.status(409).send("The User is Already Registered");
      }
      else{
        const hashedPassword = await bcrypt.hash(password, 12);
        const q = "INSERT INTO auth(`name`, `email`, `password`) VALUES (?)";

        const values = [
          name,
          email,
          hashedPassword
        ];
      
        db.query(q, [values], (err, data) => {
          if (err) return res.send(err);
    
          const result={
            "id": data.insertId,
            name,
            email
            }        
          return res.send({"msg":"registration successful",result});
        });
    }
    });
   
    // save the user.
   
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res
      .status(400)
      .json({ error: "please enter all the required fields!" });

  // email validation.
  const emailReg =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!emailReg.test(email))
    return res
      .status(400)
      .json({ error: "please enter a valid email address." });

  try {
  


    db.query(
        `SELECT * FROM auth WHERE email = ${db.escape(email)};`,
        (err, result) => {
        // user does not exists
        if (err) {
       
        return res.status(400).send({
        msg: err
        });
        }
        if (!result.length) {
        return res.status(401).send({
        msg: 'Email or password is incorrect!'
        });
        }
        // check password
        bcrypt.compare( req.body.password,result[0]['password'],(bErr, bResult) => {
        // wrong password
        if (bErr) {
       
        return res.status(401).send({
        msg: 'Email or password is incorrect!'
        });
        }
        if (bResult) {
        const token = jwt.sign({id:result[0].id},process.env.JWT_SECRET,{ expiresIn: "2d" });
       
        result[0].password=undefined;
       return res.status(200).send({
        msg: 'Logged in!',
        token,
        user: result[0]
        });
        }
        return res.status(401).send({
       msg: 'Username or password is incorrect!'
        });
       }
      );
      }
      );


    // return res.status(200).json({ token, user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
});


module.exports = router;

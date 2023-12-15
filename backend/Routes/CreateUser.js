const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const jwtSecret = 'SeceritKey'

router.post(
  '/createuser',
  [
    body('email','Incorect email').isEmail(),
    body('name','Incorect name').isLength({ min: 3 }),
    body('password','Incorect password').isLength({ min: 4 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({ errors: errors.array() });
    }

    const salt = await bcrypt.genSalt(10)
    const secPassword = await bcrypt.hash(req.body.password, salt)

    try {
      await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPassword,
      });
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.json({ success: false });
    }
  }
);

// Login


router.post(
    '/loginuser', [
        body('email').isEmail(),
        body('password').isLength({ min: 4 }),
      ],
       async (req, res) => {

           const errors = validationResult(req);
           if (!errors.isEmpty()) {
               return res.json({ errors: errors.array() });
            }
            const email = req.body.email;

      try {
        const userData = await User.findOne({email});
        if(!userData){
            return res.json({errors: 'try login with right data'})
        }


        const pswdCompare = await bcrypt.compare(req.body.password, userData.password)
        if(!pswdCompare){
            return res.json({errors: 'try login with right data'})
        }

        const data = {
          user:{
            id:userData.id
          }
        }

        const authToken = jwt.sign(data, jwtSecret)
        return res.json({success:true, authToken:authToken})

      } catch (error) {
        console.error(error);
        res.json({ success: false });
      }
    }
  );

module.exports = router;

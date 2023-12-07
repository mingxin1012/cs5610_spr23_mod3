const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

// Registration route
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          return res.status(400).send('User already exists');
        }
    
        const user = new User({ username, password });
        await user.save();

        const token = jwt.sign(username, "MINGXIN_PASSWORD");

        res.cookie("username", token)

        return res.status(201).send('User registered successfully');
      } catch (error) {
        return res.status(500).send('Server error');
      }
});

// Login route
router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(403).send('User does not exist');
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(403).send('Invalid credentials');
      }

      const token = jwt.sign(username, "MINGXIN_PASSWORD");

      res.cookie("username", token)
      return res.send('Logged in successfully');

    } catch (error) {
      console.error('Error:', error);
      return res.status(500).send('Server error: ' + error.message);
    }
});

router.get('/isLoggedIn', async function(req, res) {

  const username = req.cookies.username;

  if(!username) {
      return res.send({username: null})
  }
  let decryptedUsername;
  try {
      decryptedUsername = jwt.verify(username, "MINGXIN_PASSWORD")
  } catch(e) {
      return res.send({username: null})
  }
  
  if(!decryptedUsername) {

      return res.send({username: null})
  } else {
      return res.send({username: decryptedUsername})
  }

})

router.post('/logOut', async function(req, res) {

  res.cookie('username', '', {
      maxAge: 0,
  })

  res.send(true);

});


router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/updateDescription/:username', async (req, res) => {
  try {
      const { username } = req.params;
      const { description } = req.body;

      const user = await User.findOne({ username });
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      user.description = description;
      await user.save();

      res.json({ message: 'Description updated successfully' });
  } catch (error) {
      console.error('Error updating description:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
  }
});


module.exports = router;
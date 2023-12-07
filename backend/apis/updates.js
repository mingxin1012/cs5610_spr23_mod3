const express = require('express');
const router = express.Router();
const StatusUpdate = require('../models/StatusUpdate');
const User = require('../models/User'); 

router.post('/post', async (req, res) => {
    try {
      const { username, text } = req.body;
      const newUpdate = new StatusUpdate({ username, text });
      const savedUpdate = await newUpdate.save();

      // const user = await User.findOne({ username });
      // user.statusUpdates.push(savedUpdate._id); 
      // await user.save();
      res.json(savedUpdate);
    } catch (error) {
      res.status(500).json({ message: 'Error posting status update', error: error.message });
    }
});

router.get('/updates', async (req, res) => {
    try {
      const updates = await StatusUpdate.find().sort({ createdAt: -1 });
      res.json(updates);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching status updates', error: error.message });
    }
});

router.get('/updates/:username', async (req, res) => {
    try {
      const { username } = req.params;
      const updates = await StatusUpdate.find({ username }).sort({ createdAt: -1 });
      if (!updates.length) {
        return res.status(404).json({ message: 'No updates found for this user' });
      }
      res.json(updates);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving user updates', error: error.message });
    }
});

router.delete('/delete/:updateId', async (req, res) => {
  try {
      const { updateId } = req.params;
      const update = await StatusUpdate.findByIdAndRemove(updateId);
      if (!update) {
          return res.status(404).json({ message: 'Update not found' });
      }

      // if(username !== update.username){
      //     return res.status(404).json({ message: 'You have no permission' });
      // }


      res.json({ message: 'Update deleted successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/update/:updateId', async (req, res) => {
  try {
      const { updateId } = req.params;
      const { text } = req.body;
  
      const update = await StatusUpdate.findById(updateId);
      if (!update) {
          return res.status(404).json({ message: 'Update not found' });
      }

      // if(username !== update.username){
      //     return res.status(404).json({ message: 'You have no permission' });
      // }

      update.text = text;
      await update.save();

      res.json({ message: 'Update edited successfully', update });
  } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { chatWithAI, getChatHistory } = require('../controllers/chatController');

// All authenticated users can use the chat
router.post('/', auth, chatWithAI);
router.get('/history', auth, getChatHistory);

module.exports = router;

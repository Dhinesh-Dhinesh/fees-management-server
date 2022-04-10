const express = require('express');

// <-----Route Import's----->
const { signUp, login, verifyToken, getUser } = require('../controllers/userController');

const router = express.Router();


// <-----Routes----->

router.post("/signup", signUp);
router.post("/login", login);
router.get("/user", verifyToken, getUser);

// <-----Export----->
module.exports = router;
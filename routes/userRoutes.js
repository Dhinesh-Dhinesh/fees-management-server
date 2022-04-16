const express = require('express');

// <-----Route Import's----->
const { 
    signUp, logIn, verifyToken,
    getUser, logOut
} = require('../controllers/userController');

const router = express.Router();


// <-----Routes----->

router.post("/signup", signUp);
router.post("/login", logIn);
router.get("/user", verifyToken, getUser);
router.get("/logout",logOut);
// <-----Export----->
module.exports = router;
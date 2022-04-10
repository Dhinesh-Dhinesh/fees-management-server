const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//SignUp Function
const signUp = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'User already exists'
            });
        }

        const hashedPassword = await bcrypt.hashSync(password);

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });
        await newUser.save();

        res.status(201).json({
            message: 'User created successfully'
        });
    } catch (e) {
        console.log(e);
    }
}

//LogIn Function
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: 'User does not exist'
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: 'Incorrect password'
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30s'
        });

        res.cookie(String(user._id), token, {
            path: '/',
            httpOnly: true,
            expires: new Date(Date.now() + 30000),
            sameSite: 'lax'
        })

        return res.status(200).json({
            message: 'User logged in successfully',
            user,
            token,
        });
    } catch (e) {
        console.log(e);
    }
}

//Verifying sending token Function
const verifyToken = async (req, res, next) => {
    const cookies = req.headers.cookie;
    try {
        const token = cookies.split('=')[1];
        
        if (!token) {
            return res.status(401).json({
                message: 'No token provided'
            });
        }

        jwt.verify(String(token), process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(401).json({
                    message: 'Invalid token'
                });
            }

            req.id = user.id;
            next();
        })

    } catch (e) {
        return res.status(401).json({
            message: 'No token provided' 
        });
    }

}

//Getting user info
const getUser = async (req, res) => {
    const userId = req.id;
    let user;
    try {
        user = await User.findById(userId);
    } catch (e) {
        new Error(e);
    }

    if (!user) {
        return res.status(404).json({
            message: 'User not found'
        });
    }
    res.status(200).json({
        message: 'User found',
        user
    });
}


// <-----Export----->
exports.signUp = signUp
exports.login = login
exports.verifyToken = verifyToken
exports.getUser = getUser
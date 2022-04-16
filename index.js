const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();


const app = express();

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
// <-----Routes Import's----->

const routes = require('./routes/userRoutes');


// <-----Connect to MongoDB----->

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB Atlas');
})

mongoose.connection.on('error', (err) => {
    console.log('Error in MongoDB Atlas: ', err);
})

// <-----Routes----->

app.use('/api', routes);

// <-----PORT----->

app.listen(process.env.PORT || 4000,()=>{
    console.log('Server is running on port 3000');
});
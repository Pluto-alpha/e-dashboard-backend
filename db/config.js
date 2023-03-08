const mongoose = require('mongoose');


const connectDb = async () => {
    mongoose.connect('mongodb://127.0.0.1:27017/e-comm');
    console.log("------Database Connected!---------")
}
connectDb();


const mongoose = require('mongoose');

const myDB = async () =>{
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log("Database connected..")
}

module.exports = myDB
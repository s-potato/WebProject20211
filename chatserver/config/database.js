const mongoose = require('mongoose');
const bluebird = require('bluebird');

mongoose.Promise = bluebird;

const dbconnect = () => {
    mongoose.connect(process.env.MONGO,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    mongoose.connection.on('connected', () => {
        console.log(`MongoDB: ${process.env.MONGO} connected.`);
    });
    mongoose.connection.on('error', err => {
        console.log(`Fail to connect to ${process.env.MONGO}`);
        console.log(err);
    });
}

module.exports = dbconnect;

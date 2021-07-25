const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const registrationSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: 'Please Enter first name'
    },
    lastname: String,
    username:{
        type: String,
        unique: true,
        required: 'Please Enter User name' 
    }
  });

registrationSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Registration', registrationSchema);
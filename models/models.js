var connect = process.env.MONGODB_URI;
var mongoose = require('mongoose');
mongoose.connect(connect);
var schema = mongoose.Schema;


var Userschema = schema({
    phoneNumber: {
        type: String
    },
    username:{
        type: String
    },
    password:{
        type: String
    }
})

var User = mongoose.model('User', Userschema);

module.exports = {
    User: User,
}

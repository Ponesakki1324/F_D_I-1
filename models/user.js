const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

mongoose.connect("mongodb://localhost:27017/F_D_I",{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
console.log("Database connected");
const userSchema = mongoose.Schema({
    username:{
        type:String,
        unique:true,
        required: true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    confirmpassword:{
        type:String,
        required:true
    },
    mob_number:{
        type:Number,
        unique:true,
        required:true
    },
    alter_mobnumber:{
        type:Number,
        unique:true,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    }
});

userSchema.pre("save", function(next) {
    if(!this.isModified("password")) {
        return next();
    }
    this.password = bcrypt.hashSync(this.password, 10);
    next();
});

userSchema.methods.comparePassword = function(plaintext, callback) {
    return callback(null, bcrypt.compareSync(plaintext, this.password));
};

const userModel = mongoose.model('user',userSchema)

module.exports = userModel
const mongoose = require("mongoose")

const { Schema } = mongoose;

const userSchema = new Schema({
    user:{
        type: String,
        
    },
    email:{
        type: String,
        required:true,
        unique:true
    },
    password:{
        type: String,
        required:true,
        joinedOn:{
            type: Date,
            default:Date.now()
    
    
        },
        forgetPassword:{
            time:Date,
            otp:String
        }
    },
   
    token:{
        type: String,
    }

},
    {
        collection:"User"
    }
    
);


module.exports = mongoose.model("User",userSchema)





import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true,
        unique:true
    },

    mobile:{
        type:String,
        required:true,
        unique:true
    },

    course:{
        type:String,
        required:true
    },

    state:{
        type:String,
        required:true
    },

    city:{
        type:String,
        required:true
    }

},{timestamps:true})

const User = mongoose.model("User", userSchema)

export default User
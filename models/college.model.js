import mongoose from "mongoose";

const collegeSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    website:{
        type:String,
        required:true
    },
    contact:{
        type:String,
        required:true
    },
    logo:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    image:[
    {type:String}
    ],

    description:{
        type:String,
        required:true
    },

    course:[
    {
        courseName:{
            type:String,
            required:true,
        },
        fee:{
            type:String,
            required:true
        },
        placement:{
            type:String,
            required:true
        }
    }
    ],

    facilities:[
        {
            type:String,
        }
    ],

    averagePlacement:{
        type:String,
        required:true
    }

},{timestamps:true}) 

const College = mongoose.model("College", collegeSchema)

export default College
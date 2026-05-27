const mongoose=require('mongoose');
const interviewSchema= new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    role:{
        type:String,
        required:true
    },
    questions:{
        type:[String],
        default:[]
    },
    answers:{
        type:[String],
        default:[]
    },
    score:{
        type:Number,
        default:0
    },
    feedback:{
        type: String,
        default:""
    }
},{timestamps:true})

module.exports= mongoose.model("Interview",interviewSchema);
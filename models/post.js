const mongoose = require ('mongoose')
const {ObjectId} = mongoose.Schema.Types

const postSchema = new mongoose.Schema ({
    title : {
        type : String,
        required : true
    },
    body : {
        type : String,
        required : true
    },
    photo : {
        type : String,
        required : true
    },
    likes:[{type:ObjectId,ref:"User"}],
    comments:[{
        type:String,
        postedBy:{type:ObjectId,ref:"User"}
    }],
    postedBy : {
        type : ObjectId, //Id of the user who has created post
        ref : "User"
    }
})

mongoose.model("Post",postSchema)
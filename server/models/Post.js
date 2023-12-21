const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    caption: {
        type: String
    },
    imgUrl: {
        public_id: String,
        url: String
    }, 
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }, 
    createdAt: {
        type: Date, 
        default: Date.now,
    }, 
    likes: [ 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    comments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }, 
            comments: {
                type: String, 
                required: true
            }
        }
    ]
})

module.exports = mongoose.model("Post", postSchema)
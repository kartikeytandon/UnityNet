const Post = require("../models/Post");
const User = require("../models/User")

exports.createPost = async (req, res) => {
    try {
        const newPostData = {
            caption: req.body.caption,
            image: {
                public_id: "req.body.public_id",
                url: "req.body.url"
            },  
            owner: req.user._id
        }

        const newPost = await Post.create(newPostData)
        
        const user = await User.findById(req.user._id)
        user.posts.push(newPost._id)

        await user.save()

        res.status(201).json({
            success: true,
            post: newPost
        })
    } catch (error) {
        res.send(500).json({
            success: false,
            message: error.message,
        })
    }
}

exports.deletePost = async (req, res) => {
    try {
        const postId = req.params.id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        if (post.owner.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        const deletedPost = await Post.findByIdAndDelete(postId);

        if (!deletedPost) {
            return res.status(500).json({
                success: false,
                message: 'Error deleting post'
            });
        }

        const user = await User.findById(req.user._id);

        // Remove the postId from the user's posts array
        user.posts.pull(postId);

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Post deleted successfully'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.likeAndUnlikePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        if(!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            })
        }

        if(post.likes.includes(req.user._id)) {
            const index = post.likes.indexOf(req.user._id)

            post.likes.splice(index, 1)

            await post.save()

            return res.status(200).json({
                success: true,
                message: "Post Unliked"
            })
        } else {
            post.likes.push(req.user._id)

            await post.save()

            return res.status(200).json({
                success: true,
                message: "Post Liked"
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

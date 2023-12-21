const User = require('../models/User.js');

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body

        let user = await User.findOne({ email })
        if(user) {
            return res.status(400).json({
                success: false, 
                message: "User already exists"
            })
        }

        user = await User.create({ 
            name, 
            email, 
            password, 
            avatar: {public_id: "sample_id", url: "sample_url"} 
        })

        // Making user login directly after the registration is completed
        const token = await user.generateToken()

        res.status(201).cookie("token", token, { 
            expires: new Date(Date.now()+10*24*60*60*1000), 
            httpOnly: true
        }).
        json({
            success: true,
            user,
            token,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email }).select("+password")

        if(!user) {
            return res.status(400).json({
                success: false,
                message: "User does not exists"
            })
        }

        const isMatch = await user.matchPassword(password)

        if(!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Incorrect Password"
            })
        }

        const token = await user.generateToken()

        res.status(201).cookie("token", token, { 
            expires: new Date(Date.now()+10*24*60*60*1000), 
            httpOnly: true
        }).
        json({
            success: true,
            user,
            token,
        })
    } catch (error) {
        res.status(500).json({
            success: false, 
            message: error.message,
        })
    }
}

exports.followUser = async (req, res) => {
    try {
        const userToFollow = await User.findById(req.params.id)
        const loggedInUser = await User.findById(req.user._id)

        if(!userToFollow) {
            res.status(404).json({
                success: false,
                message: "User Not found"
            })
        }

        if(loggedInUser.following.includes(userToFollow._id)) {
            const index = loggedInUser.following.indexOf(userToFollow._id)
            loggedInUser.following.splice(index, 1)

            const indexfollowers = userToFollow.follower.indexOf(loggedInUser._id)
            userToFollow.follower.splice(indexfollowers, 1)

            await loggedInUser.save()
            await userToFollow.save()

            res.status(200).json({
                success: true,
                message: "User Unfollwed"
            })
        } else {
            loggedInUser.following.push(userToFollow._id)
            userToFollow.follower.push(loggedInUser._id)

            await loggedInUser.save()
            await userToFollow.save()

            res.status(200).json({
                success: true,
                message: "User Follwed"
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
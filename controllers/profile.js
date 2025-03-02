// DEPENDENCIES

const express = require('express');
const router = express.Router();
const app = express();

const User = require('../models/user.js');
const Forum = require('../models/forum.js');

const homebrew = require('../homebrew_functions.js');

// MIDDLEWARE

// ROUTES BELOW

router.get('/', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        const forums = await Forum.find();
        const userBase = await User.find()


        res.render('profile/index.ejs', {
            userAdmin: currentUser.isAdmin,
            allUsers: userBase,
            forumDisplays: forums
        })
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

router.get('/:profileName/:profileId', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        const profileUser = await User.fintById(req.params.profileId);
        const forums = await Forum.find();
        


        res.render('profile/index.ejs', {
            userTopics: currentUser.topics,
            profileTarget: profileUser,
            allUsers: returnUserBase(await User.find()),
            forumDisplays: forums
        })
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});





// EXPORT
module.exports = router;
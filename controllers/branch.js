// DEPENDENCIES

const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Forum = require('../models/forum.js');

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
}



// ROUTES WILL GO HERE

router.get('/', async (req, res) => {
    try {
        
        const currentUser = await User.findById(req.session.user._id);
        
        res.render('forums/index.ejs', {
            userTopics: currentUser.topics,
        })
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

router.get('/:forumBranch', async (req, res) => {
    try {
        const currentBranch = await Forum.findOne({ forum_branch: req.params.forumBranch});
        const branchName = await currentBranch.forum_branch

        res.render('branch/index.ejs', {
            user: req.session.user,
            forumBranch: currentBranch,
            branchName: capitalizeFirstLetter(branchName),
        });
    } catch(error) {
        console.log(error);
        res.redirect('/');
    }
});



module.exports = router;
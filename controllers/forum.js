// DEPENDENCIES

const express = require('express');
const router = express.Router();
const app = express();

const branchController = require('./branch.js')

const User = require('../models/user.js');
const Forum = require('../models/forum.js');

const homebrew = require('../homebrew_functions.js');
const { isObjectIdOrHexString, isValidObjectId, default: mongoose } = require('mongoose');



const branchNames = ["main", "art", "games"];


// ROUTES WILL GO HERE

router.get('/', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        
        const forums = homebrew.modelToArray(Forum,"forum_branch",branchNames);

        res.render('forums/index.ejs', {
            userTopics: currentUser.topics,
            forumDisplays: forums
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

        const branchTopics = homebrew.getObjArr(currentBranch)


        res.render('branch/index.ejs', {
            user: req.session.user,
            forumBranch: currentBranch,
            branchName: homebrew.capitalizeFirst(branchName),
            topics: branchTopics,
            getAuthor: homebrew.getObjectFromID,
            userModel: User,
        });
    } catch(error) {
        console.log(error);
        res.redirect('/');
    }
});

router.get('/:forumBranch/new', async (req, res) => {
    try {
        const currentBranch = await Forum.findOne({ forum_branch: req.params.forumBranch});
        const branchName = await currentBranch.forum_branch;

        const branchTopics = homebrew.getObjArr(currentBranch)
        res.render('branch/new.ejs', {
            user: req.session.user,
            forumBranch: currentBranch,
            branchName: homebrew.capitalizeFirst(branchName),
            topics: branchTopics,
            getAuthor: homebrew.getObjectFromID,
            userModel: User,
        });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

router.post('/:forumBranch', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        const currentBranch = await Forum.findOne({forum_branch: req.params.forumBranch});
        const branchName = await currentBranch.forum_branch;

        const topicObject = {
            author_id: await req.session.user._id,
            date: Date.now(),
            title: await req.body.title,
            content: await req.body.content,
            linked: await req.body.linked,
        }

        currentBranch.topics.push(topicObject)

        await currentBranch.save();


        res.redirect(`/user/${currentUser.displayname}/total-recall/${branchName}`);
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});


module.exports = router;
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
        const userBase = await User.find();



        const userActivity = 1;

        
        let usersArr=[];

        await userBase.forEach(async(user)=>{

            const userObj={};

            userObj._id = user._id;
            userObj.displayname = user.displayname;
            userObj.userSince = homebrew.getDatePair(user.userSince,new Date(Date.now()));
            userObj.linkedavatar = user.linkedavatar;
            userObj.comments = [];
            userObj.topics = [];
            userObj.isAdmin = user.isAdmin;

            
            let branchSifter = 0;
            forums.forEach((branch) => {

                branch.topics.forEach((topic) => {
                    if(String(topic.author_id) == String(user._id)) {
                        userObj.topics.push({
                            branch: branch,
                            topic: topic,
                        });
                        return;
                    };
                    topic.comments.forEach((comment) => {
                        if(String(comment.author_id) == String(user._id)) {
                            userObj.comments.push({
                                branch: branch,
                                topic: topic,
                                comment: comment,
                            });
                            return;
                        };
                    });
                });
                branchSifter++;
            });

            if(branchSifter===3) {
                usersArr.push(userObj);
                usersArr.sort(
                    (a,b)=> b.userSince.real.getTime() - a.userSince.real.getTime()
                );
            };

        });

        const profileUsers = usersArr;


        if(profileUsers.length===userBase.length){
            res.render('profile/index.ejs', {
                userAdmin: currentUser.isAdmin,
                allUsers: profileUsers,
                monthArray: homebrew.months,
            })
        }
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

router.get('/:profileName/:profileId', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        const profileUser = await User.findById(req.params.profileId);
        const forums = await Forum.find();
        const allUsers = await User.find();


        const userArray = {};
        let allUsersObj ={};

        await allUsers.forEach((user)=>{
            userArray[String(user._id)] = user;
        });
        
        if(Object.keys(userArray).length==allUsers.length){
            allUsersObj=userArray;
        };

        const profileObj={};

        profileObj._id = profileUser._id;
        profileObj.displayname = profileUser.displayname;
        profileObj.userSince = homebrew.getDatePair(profileUser.userSince,new Date(Date.now()));
        profileObj.linkedavatar = profileUser.linkedavatar;
        profileObj.comments = [];
        profileObj.topics = [];
        profileObj.isAdmin = profileUser.isAdmin;

        
        let branchSifter = 0;
        forums.forEach((branch) => {

            branch.topics.forEach((topic) => {
                if(String(topic.author_id) == String(profileUser._id)) {
                    profileObj.topics.push({
                        branch: branch,
                        topic: topic,
                    });
                    return;
                };
                topic.comments.forEach((comment) => {
                    if(String(comment.author_id) == String(profileUser._id)) {
                        profileObj.comments.push({
                            branch: branch,
                            topic: topic,
                            comment: comment,
                        });
                        return;
                    };
                });
            });
            branchSifter++;
        });

        
        if(branchSifter===3) {
            res.render('profile/show.ejs', {
                userBase: allUsersObj,
                userTopics: currentUser.topics,
                profileTarget: profileObj,
                monthArray: homebrew.months,
            })
        };
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});





// EXPORT
module.exports = router;
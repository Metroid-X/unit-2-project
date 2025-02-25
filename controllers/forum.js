// DEPENDENCIES

const express = require('express');
const router = express.Router();
const app = express();

const mongoose = require('mongoose')

const User = require('../models/user.js');
const Forum = require('../models/forum.js');

const homebrew = require('../homebrew_functions.js');


const branchNames = ["main", "art", "games"];



const returnUserBase = async(userModelArr) => {

    let usersArr=[];

    await userModelArr.forEach((user) => {
        usersArr.push({
            _id: user._id,
            displayname: user.displayname,
            linkedavatar: user.linkedavatar,
        });
    });
    
    return usersArr;

}


        // ROUTES WILL GO HERE

    // Main Route 
router.get('/', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        
        const forums = homebrew.modelToArray(Forum,"forum_branch",branchNames);

        res.render('forums/index.ejs', {
            userTopics: currentUser.topics,
            allUsers: returnUserBase(await User.find()),
            forumDisplays: forums
        })
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});




    // Branch Routes
router.get('/:forumBranch', async (req, res) => {
    try {
        const currentBranch = await Forum.findOne({ forum_branch: req.params.forumBranch});
        const branchName = await currentBranch.forum_branch;

        const allUsers = await User.find();


        const userArray = {};
        let allUsersObj ={};

        await allUsers.forEach((user)=>{
            userArray[String(user._id)] = user;
        });
        
        

        

        let topicsArr=[];
        
        await currentBranch.topics.forEach(async(topic)=>{

            if(Object.keys(userArray).length==allUsers.length){
                allUsersObj=userArray;
            }


            const topicObj={};


            topicObj.author_id=topic.author_id;
            topicObj.date = homebrew.conciseDate(topic.date);
            topicObj.title = topic.title;
            topicObj.content = topic.content
            topicObj.linked = topic.linked
            topicObj._id = topic._id
            topicObj.comments = topic.comments
            topicObj.author = allUsersObj[String(topic.author_id)]
            
            topicsArr.push( topicObj);
        });
        
        const branchTopics = topicsArr;
        
        if(branchTopics.length===currentBranch.topics.length){
            res.render('branch/index.ejs', {
                user: req.session.user,
                conciseDate: homebrew.conciseDate,
                allUsers: allUsers,
                forumBranch: currentBranch,
                branchName: homebrew.capitalizeFirst(branchName),
                topics: branchTopics//currentBranch.topics,
            });
        }
    } catch(error) {
        console.log(error);
        res.redirect('/');
    }
});


// This is the GET route for the /new branch topic page
router.get('/:forumBranch/new', async (req, res) => {
    try {
        const currentBranch = await Forum.findOne({ forum_branch: req.params.forumBranch});
        const branchName = await currentBranch.forum_branch;

        const branchTopics = homebrew.getNewTopicsArray(currentBranch,User);

        res.render('branch/new.ejs', {
            user: req.session.user,
            forumBranch: currentBranch,
            branchName: homebrew.capitalizeFirst(branchName),
            topics: branchTopics,
        });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});


// This is the POST route for the /new topic on the branch
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


        res.redirect(`/${currentUser.displayname}/total-recall/${branchName}`);
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

    // Branch Topic Routes
// SHOW Route for any topic; Includes receiving a schema for the comments.

router.get('/:forumBranch/:topicName/:topicId', async (req, res) => {
    const currentUser = await User.findById(req.session.user._id);
    const currentBranch = await Forum.findOne({forum_branch: req.params.forumBranch});
    const currentTopic = await currentBranch.topics.find(({_id})=> _id == req.params.topicId);
    const branchName = await currentBranch.forum_branch;

    const allUsers = await User.find();
    
    const userArray = {};
    let allUsersObj ={};

    await allUsers.forEach((user)=>{
        userArray[String(user._id)] = user;
    });

    if(Object.keys(userArray).length==allUsers.length){
        allUsersObj=userArray;
    }
    const topicAuthor = await allUsersObj[String(currentTopic.author_id)];
    
    let commentsArr=[];
    
    await currentTopic.comments.forEach(async(comment)=>{

        
        if(Object.keys(userArray).length==allUsers.length){
            allUsersObj=userArray;
        }
        
        const commentObj = {
            author_id: comment.author_id,
            author: allUsersObj[String(comment.author_id)],
            date: homebrew.conciseDate(comment.date),
            content: comment.content,
            linked: comment.linked,
            _id: comment._id,
        }

        commentsArr.push(commentObj);
        if(commentObj.author!==undefined){return;};
    });
    
    const topicComments = commentsArr;
    


    const topicDate = homebrew.conciseDate(currentTopic.date)
    
    if(topicComments.length===currentTopic.comments.length){
        res.render('branch/show.ejs', {
            user: currentUser,
            author: topicAuthor,
            topic: currentTopic,
            topicDate: topicDate,
            comments: topicComments,
            branchName: homebrew.capitalizeFirst(branchName),
        });
    };
    // res.send(`here is a response with the topic object ${currentTopic}`)
});








module.exports = router;
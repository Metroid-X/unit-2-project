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
            };


            const topicObj={};


            topicObj.author_id=topic.author_id;
            topicObj.date = {
                concise: homebrew.conciseDate(topic.date),
                real: topic.date,
            };
            topicObj.dateUpdated = {
                concise: homebrew.conciseDate(topic.date_updated),
                real: topic.date_updated,
            };
            topicObj.dateActive = topic.date_active;
            topicObj.title = topic.title;
            topicObj.content = topic.content;
            topicObj.linked = topic.linked;
            topicObj._id = topic._id;
            topicObj.comments = topic.comments;

            topicObj.author = allUsersObj[String(topic.author_id)];
            
            topicsArr.push(topicObj);
            topicsArr.sort(
                (a,b)=> b.dateActive.getTime() - a.dateActive.getTime()
            )
        });
        
        const branchTopics = topicsArr;
        
        if(branchTopics.length===currentBranch.topics.length){
            res.render('branch/index.ejs', {
                user: req.session.user,
                conciseDate: homebrew.conciseDate,
                allUsers: allUsers,
                forumBranch: currentBranch,
                branchName: homebrew.capitalizeFirst(branchName),
                topics: branchTopics,
            });
        };
    } catch(error) {
        console.log(error);
        res.redirect('/');
    };
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
    };
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
        };

        currentBranch.topics.push(topicObject);

        await currentBranch.save();


        res.redirect(`/${currentUser.displayname}/total-recall/${branchName}`);
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

    // Branch Topic Routes
// SHOW Route for any topic; Includes receiving the comments.

router.get('/:forumBranch/:topicName/:topicId', async (req, res) => {
    try {
    
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
                date: {
                    concise: homebrew.conciseDate(currentTopic.date),
                    real: currentTopic.date,
                },
                dateUpdated: {
                    concise: homebrew.conciseDate(currentTopic.date_updated),
                    real: currentTopic.date_updated,
                },
                content: comment.content,
                linked: comment.linked,
                _id: comment._id,
            }

            commentsArr.push(commentObj);
            if(commentObj.author!==undefined){return;};
        });
        
        const topicComments = commentsArr;
        
        currentTopic.author = await topicAuthor;

        const topicDate = {
            concise: homebrew.conciseDate(currentTopic.date),
            real: currentTopic.date,
        };
        const topicUpdated = {
            concise: homebrew.conciseDate(currentTopic.date_updated),
            real: currentTopic.date_updated,
        };
        if(topicComments.length===currentTopic.comments.length){
            res.render('branch/show.ejs', {
                user: currentUser,
                author: topicAuthor,
                topic: currentTopic,
                topicDate: topicDate,
                topicUpdated: topicUpdated,
                comments: topicComments,
                branchName: homebrew.capitalizeFirst(branchName),
            });
        };
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});


//  Router for the topic edit route.
router.get('/:forumBranch/:topicName/:topicId/edit', async (req,res) => {
    try {
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
                date: {
                    concise: homebrew.conciseDate(currentTopic.date),
                    real: currentTopic.date,
                },
                dateUpdated: {
                    concise: homebrew.conciseDate(currentTopic.date_updated),
                    real: currentTopic.date_updated,
                },
                content: comment.content,
                linked: comment.linked,
                _id: comment._id,
            }

            commentsArr.push(commentObj);
            if(commentObj.author!==undefined){return;};
        });
        
        const topicComments = commentsArr;
        
        currentTopic.author = await topicAuthor;

        const topicDate = {
            concise: homebrew.conciseDate(currentTopic.date),
            real: currentTopic.date,
        };
        const topicUpdated = {
            concise: homebrew.conciseDate(currentTopic.date_updated),
            real: currentTopic.date_updated,
        };
        if(topicComments.length===currentTopic.comments.length){
            res.render('branch/topic_edit.ejs', {
                user: currentUser,
                author: topicAuthor,
                topic: currentTopic,
                topicDate: topicDate,
                topicUpdated: topicUpdated,
                comments: topicComments,
                branchName: homebrew.capitalizeFirst(branchName),
            });
        };
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});


// The PUT route for editing a topic
router.put('/:forumBranch/:topicName/:topicId', async (req,res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        const currentBranch = await Forum.findOne({forum_branch: req.params.forumBranch});
        const currentTopic = await currentBranch.topics.find(({_id})=> _id == req.params.topicId);
        const branchName = await currentBranch.forum_branch;
        
        const topic = currentBranch.topics.id(req.params.topicId);

        topic.set('title', req.body.title);
        topic.set('content', await req.body.content);
        topic.set('linked', await req.body.linked);
        topic.set('date_updated', Date.now());
        topic.set('date_active', Date.now());

        await currentBranch.save();

        res.redirect(
            `/${currentUser.displayname}/total-recall/${branchName}/${(topic.title).replaceAll(' ', '-')}/${req.params.topicId}`
        )
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});


// the DELETE route for the topic
router.delete('/:forumBranch/:topicName/:topicId', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        const currentBranch = await Forum.findOne({forum_branch: req.params.forumBranch});
        const currentTopic = await currentBranch.topics.find(({_id}) => _id == req.params.topicId);
        const branchName = await currentBranch.forum_branch;

        currentTopic.deleteOne();

        await currentBranch.save();

        res.redirect(`/${currentUser.displayname}/total-recall/${req.params.forumBranch}/`);
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
})




// POST route for comments on the topic.
router.post('/:forumBranch/:topicName/:topicId', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        const currentBranch = await Forum.findOne({forum_branch: req.params.forumBranch});
        const currentTopic = await currentBranch.topics.find(({_id}) => _id == req.params.topicId);
        const branchName = await currentBranch.forum_branch;

        const commentObject = {
            author_id: req.session.user._id,
            date: Date.now(),
            content: req.body.commentcontent,
            linked: req.body.commentlinked,
        }

        currentTopic.date_active = Date.now();

        currentBranch.topics.find(({_id}) => _id == req.params.topicId).comments.push(commentObject);

        await currentBranch.save();


        res.redirect(`/${currentUser.displayname}/total-recall/${branchName}/${req.params.topicName}/${req.params.topicId}`);
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
})

//  Router for the comment edit route.
router.get('/:forumBranch/:topicName/:topicId/:commentId/edit', async (req,res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        const currentBranch = await Forum.findOne({forum_branch: req.params.forumBranch});
        const currentTopic = await currentBranch.topics.find(({_id})=> _id == req.params.topicId);
        const branchName = await currentBranch.forum_branch;

        const Comment = await currentTopic.comments.id(req.params.commentId);


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
                date: {
                    concise: homebrew.conciseDate(currentTopic.date),
                    real: currentTopic.date,
                },
                dateUpdated: {
                    concise: homebrew.conciseDate(currentTopic.date_updated),
                    real: currentTopic.date_updated,
                },
                content: comment.content,
                linked: comment.linked,
                _id: comment._id,
            }

            commentsArr.push(commentObj);
            if(commentObj.author!==undefined){return;};
        });
        
        const topicComments = commentsArr;
        
        currentTopic.author = await topicAuthor;

        const topicDate = {
            concise: homebrew.conciseDate(currentTopic.date),
            real: currentTopic.date,
        };
        const topicUpdated = {
            concise: homebrew.conciseDate(currentTopic.date_updated),
            real: currentTopic.date_updated,
        };

        if(topicComments.length===currentTopic.comments.length){
            res.render('branch/comment_edit.ejs', {
                user: currentUser,
                author: topicAuthor,
                topic: currentTopic,
                topicDate: topicDate,
                topicUpdated: topicUpdated,
                comments: topicComments,
                currentComment: Comment,
                branchName: homebrew.capitalizeFirst(branchName),
            });
        };
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

// The PUT route for editing a comment
router.put('/:forumBranch/:topicName/:topicId/:commentId', async (req,res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        const currentBranch = await Forum.findOne({forum_branch: req.params.forumBranch});
        const currentTopic = await currentBranch.topics.find(({_id})=> _id == req.params.topicId);
        
        const comment = currentTopic.comments.id(req.params.commentId);

        comment.set('content', await req.body.content);
        comment.set('linked', await req.body.linked);
        comment.set('date_updated', Date.now());

        await currentBranch.save();

        res.redirect(
            `/${currentUser.displayname}/total-recall/${req.params.forumBranch}/${req.params.topicName}/${req.params.topicId}`
        )
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});


// the DELETE route for the topic
router.delete('/:forumBranch/:topicName/:topicId/:commentId', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        const currentBranch = await Forum.findOne({forum_branch: req.params.forumBranch});
        const currentTopic = await currentBranch.topics.id(req.params.topicId);
        const currentComment = await currentTopic.comments.id(req.params.commentId);
        const branchName = await currentBranch.forum_branch;

        currentComment.deleteOne();

        await currentBranch.save();

        res.redirect(`/${currentUser.displayname}/total-recall/${req.params.forumBranch}/${req.params.topicName}/${req.params.topicId}`);
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
})







module.exports = router;
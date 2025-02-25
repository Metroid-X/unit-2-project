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
        
        const allUsers = await User.find();
        
        let topicsArr=[];
        
        await currentBranch.topics.forEach(async(topic)=>{

            
            
            const topicObj = {
                author_id: topic.author_id,
                author: await allUsers.find(({_id})=> _id=topic.author_id),
                date: topic.date,
                title: topic.title,
                content: topic.content,
                linked: topic.linked,
                _id: topic._id,
                comments: topic.comments,
            }

            topicsArr.push(topicObj);
            if(topicObj.author!==undefined){return;};
        });
        
        const branchTopics = topicsArr;
        
        if(branchTopics.length===currentBranch.topics.length){
            res.render('branch/index.ejs', {
                user: req.session.user,
                
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





// EXPORT THIS
module.exports = router;
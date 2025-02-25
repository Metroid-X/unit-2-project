// DEPENDENCIES

const express = require('express');
const router = express.Router();
const app = express();

const branchController = require('./branch.js')

const User = require('../models/user.js');
const Forum = require('../models/forum.js');

const homebrew = require('../homebrew_functions.js');

// MIDDLEWARE



// ROUTES BELOW







// EXPORT
module.exports = router;
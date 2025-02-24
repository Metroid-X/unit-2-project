const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;
const Model = mongoose.Model;

const User = require('./models/user.js') 







const homebrew = {
    /**
     * Builds an array of model objects from a given model and another array of values to search for under a given object property
     * 
     * @param {Function} model The model to search through.
     * @param {String} modelProperty The String name of the model property to search for uses of.
     * @param {Array} arrRef The array with the values to match the property values with.
     * 
     * @returns {Array} An {Array} containing the qualifying objects from the model.
     */
    modelToArray: buildArrFromModel = async (model, modelProperty, arrRef) => {
        let arrOut=[];
        arrRef.forEach((item) => {
            arrOut.push(
                model.findOne({[modelProperty]: item})
            );
        });
        return arrOut;
    },
    /**
     * Capitalizes the first letter in the first character of the input string.
     * @param {String} string The string to capitalize th efirst letter of.
     * @returns {String} The sentence case conversion of the input string.
     */
    capitalizeFirst: capitalizeFirst = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },
    /**
     * Retrieves an Array from an Object.
     * 
     * @param {Object} obj The object to pass for array retrieval.
     * @param {String} objProperty The String name of the property to access.
     * 
     * @returns {Array} The array gotten at the specified property.
     */
    getObjArr: getObjectArray = (obj, objProperty) => {
        return obj[objProperty];
    },
    /**
     * 
     * @param {Object} obj The Object to reference.
     * @param {String} ref_Id The String name of the property that has the ID to fetch with.
     * @param {Function} model The Model to search for the desired Object in.
     * 
     * @returns {Object} The desired Object to grab from the Model given.
     */
    getObjectFromID: getObjectFromID = (obj, ref_Id, model) => {
        return model.findById(obj[ref_Id]);
    },
};


module.exports = homebrew;
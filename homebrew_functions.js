const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;
const Model = mongoose.Model;

const User = require('./models/user.js') 



const floor = (n) => {
    return Math.floor(n)
}
const round = (n) => {
    return Math.round(n)
}


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
    /**
     * Build a new topics Array that fetches the author objects from their _id via the author_id property of each topic.
     * @param {Object} obj The branch Object with the topics to rebuild.
     * @param {Function} model The User Model.
     * 
     * @returns {Array} the new topics Array to pass into the page.
     */
    getNewTopicsArray: getNewTopicsArray = (obj, model) => {
        let topicsArr=[];

            obj.topics.forEach((topic)=>{
                topicsArr.push({
                    author: User.findById(topic.author_id),
                    date: topic.date,
                    title: topic.title,
                    content: topic.content,
                    linked: topic.linked,
                    _id: topic._id,
                    comments: topic.comments,
                });
            });

        return topicsArr
    },

    conciseDate: conciseDate = (date) => {
        const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
        ]


        return `${months[date.getMonth()]} 
                ${date.getDate()}, 
                ${date.getFullYear()}`
    },
    perYear: perYear = () => {
        const daysPerYear = 365.242374;
        const hoursPerYear = (daysPerYear*24);
        const minutesPerYear = (hoursPerYear*60);
        const secondsPerYear = (minutesPerYear*60); 
        const millisecondsPerYear = (secondsPerYear*1000); 

        


        return {
            days: daysPerYear,
            oneMinute: 60000,
            oneHour: 3600000,
            oneDay: 86400000,
            oneWeek: 1,
            oneMonth: 1,
            oneYear: 1,
            oneDecade: 1,
        }
    },
    getDatePair: getDatePair = (date1, date2) => {
        
        const yearDiff = date1.getUTCFullYear()-date2.getUTCFullYear();
        const monthDiff = date1.getUTCMonth()-date2.getUTCMonth();
        const weekDiff = floor((round(date2/7)-round(date1/7))*7/604800000);
        // const dayDiff = date1.getUTCDate()-date2.getUTCDate();
        const dayDiff = floor((round(date2/24)-round(date1/24))*24/86400000);
        const hourDiff = date1.getUTCHours()-date2.getUTCHours();
        const minuteDiff = date1.getUTCMinutes()-date2.getUTCMinutes();
        const secondDiff = date1.getUTCSeconds()-date2.getUTCSeconds();
        

        let result = {
            // If all else fails, fall back on the actual date alone.
            concise: `${homebrew.conciseDate(date1)}`,

            real: date1,
        };
        let yearAmount =    '';
        let monthAmount =   '';
        let weekAmount =   '';
        let dayAmount =     '';
        let hourAmount =    '';
        let minuteAmount =  '';
        let secondAmount =  '';

        
        const millisecondsPerYear = Math.floor(86400000*365.242374);
        const millisecondsPerMonth = Math.floor(86400000*30.4167);

        const otherYearDiff = Math.floor(Number(date2-date1)/millisecondsPerYear);
        const otherMonthDiff = Math.floor(Number(date2-date1)/millisecondsPerMonth);




            if( -yearDiff >= 1) {
                // if at least one year
                if( -yearDiff == 1) {
                    // if exactly one year
                    switch(Math.sign(monthDiff)) {
                        case(-1):
                            // if a month or more into next year
                            if(Math.abs(monthDiff) > 3) {
                                yearAmount = 'Over a year ago'
                            } else {
                                yearAmount = '1 year ago'
                            }
                            break;
                        case(0):
                            // if the same month next year
                            yearAmount = '1 year ago'
                            break;
                        case(1):
                            const monthsFrom = 12-monthDiff
                            
                            // if less than twelve months from date1
                            yearAmount = ''
                            if(monthsFrom >= 1) {
                                // if at least one month
                                if(monthsFrom == 1) {
                                    // if january of date2; ( yMonths(12) - ( y1dec(11)-y2jan(0) ) = 1 )
                                    monthAmount = '1 month ago';
                                } else {
                                    monthAmount = `${monthDiff} months ago`
                                }
                            } else if(weekDiff >= 1){
                                // if at least one week
                                if(weekDiff == 1){
                                    weekAmount=`${weekDiff} week ago`;
                                } else {
                                    weekAmount=`${weekDiff} weeks ago`;
                                }
                            } else if(dayDiff >= 1) {
                                // if at least one day
                                if(dayDiff == 1){
                                    dayAmount=`${dayDiff} day ago`;
                                } else {
                                    dayAmount=`${dayDiff} days ago`;
                                }
                            } else if((date2-date1) >= 3600000){
                                // if at least one hour
                                if(hourDiff == -1){
                                    hourAmount=`${hourDiff} hour ago`;
                                } else {
                                    hourAmount=`${hourDiff} hours`;
                                }
                            } else if((date2-date1) >= 600000){
                                // if at least one minute
                                if(minuteDiff == -1){
                                    minuteAmount=`${minuteDiff} minute ago`;
                                } else {
                                    minuteAmount=`${minuteDiff} minutes ago`;
                                }
                            } else if((date2-date1) >= 10000){
                                // if at least one second
                                if(secondDiff == -1){
                                    secondAmount=`${secondDiff} second ago`;
                                } else {
                                    secondAmount=`${secondDiff} seconds ago`;
                                }
                            }
                            
                            
                            break;
                        default: ;
                    }
                } else {
                    switch(Math.sign(monthDiff)) {
                        case(-1):
                            // if a month or more into next year
                            if(Math.abs(monthDiff) > 3) {
                                yearAmount = `${yearDiff} years ago`
                            } else {
                                yearAmount = `${yearDiff} years ago`
                            }
                            break;
                        case(0):
                            // if the same month next year
                            yearAmount = `${yearDiff} years ago`
                            break;
                        case(1):
                            yearAmount = `${yearDiff-1} years ago`
                            break;
                        default:;
                    }
                }
            } else {
                // if the same year
                if(-monthDiff > 1) {
                    // if over one month
                    
                    monthAmount = `${monthDiff} months ago`
                    
                } else if(weekDiff >= 1){
                    // if at least one week
                    if(weekDiff == 1){
                        weekAmount=`${weekDiff} week ago`;
                    } else {
                        weekAmount=`${weekDiff} weeks ago`;
                    }
                } else if(dayDiff >= 1) {
                    // if at least one day
                    if(dayDiff == 1){
                        dayAmount=`${dayDiff} day ago`;
                    } else {
                        dayAmount=`${dayDiff} days ago`;
                    }
                } else if((date2-date1) >= 3600000){
                    // if at least one hour
                    if(hourDiff == -1){
                        hourAmount=`${floor((date2-date1)/3600000)} hour ago`;
                    } else {
                        hourAmount=`${floor((date2-date1)/3600000)} hours ago`;
                    }
                } else if((date2-date1) >= 600000){
                    // if at least one minute
                    if(minuteDiff == -1){
                        minuteAmount=`${floor((date2-date1)/600000)} minute ago`;
                    } else {
                        minuteAmount=`${floor((date2-date1)/600000)} minutes ago`;
                    }
                } else if((date2-date1) >= 10000){
                    // if at least one second
                    if(secondDiff == -1){
                        secondAmount=`${floor((date2-date1)/10000)} second ago`;
                    } else {
                        secondAmount=`${floor((date2-date1)/10000)} seconds ago`;
                    }
                } else if((date2-date1) < 10000){
                    secondAmount = 'just now'
                }
            }
            
            if(otherMonthDiff >= 1) {monthAmount = `${otherMonthDiff} months ago`}
        
            result.concise = `${secondAmount}${minuteAmount}${hourAmount}${dayAmount}${weekAmount}${monthAmount}${yearAmount} | ${homebrew.conciseDate(date1)}`
            
            return result;
    },

    branchNames: ["main", "art", "games"],
    months: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ],
    
};
// const date1 = new Date("May 1, 2025 00:0:00");
// const date2 = new Date("May 2, 2025 00:0:00")
// const date3 = String(date2 - date1)

// console.log(new Date(Date.now()).getUTCFullYear())

module.exports = homebrew;
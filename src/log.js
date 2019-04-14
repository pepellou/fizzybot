var dateformat = require('dateformat');

module.exports = function(msg) {
    console.log(dateformat(new Date(), '[HH:MM] ') + msg);
}

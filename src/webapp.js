var express = require('express'),
    app = express(),
    cors = require('cors'),
    log = require('./log.js');

const PORT = process.env.PORT || 3000;

module.exports = {
    run: function() {
        app.use(cors());

        app.listen(PORT, () => {
            log(`Our app is running on port ${ PORT }`);
        });
    }
};

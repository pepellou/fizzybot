var express = require('express'),
    app = express(),
    cors = require('cors');

const PORT = process.env.PORT || 3000;

module.exports = {
    run: function() {
        app.use(cors());

        app.listen(PORT, () => {
            console.log(`Our app is running on port ${ PORT }`);
        });
    }
};

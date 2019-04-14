var express = require('express'),
    app = express(),
    cors = require('cors'),
    path = require('path'),
    log = require('./log.js'),
    hb = require('express-handlebars');

module.exports = {
    run: function() {
        app.set('port', process.env.PORT || 3000);
        app.set('views', path.join(__dirname, 'views'));
        app.engine('.hbs', hb({
            defaultLayout: 'main',
            layoutsDir: path.join(app.get('views'), 'layouts'),
            partialsDir: path.join(app.get('views'), 'partials'),
            extname: '.hbs',
            helpers: require('./lib/hb.js')
        }));
        app.set('view engine', '.hbs');

        app.use(cors());
        app.use(require('./routes/index.js'));

        app.use(express.static(path.join(__dirname, 'public')));

        app.listen(app.get('port'), () => {
            log(`Our app is running on port ${ app.get('port') }`);
        });
    }
};

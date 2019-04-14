var tmi = require('tmi.js'),
    config = require('./config.js'),
    db = require('./db.js');

var Bot = function() {
    var self = this;

    self.init = function() {
        self.bad_words_timeout_seconds = 120;
        db.getChannels(function(channels) {
            self.getClient(channels);
            self.client.connect();
            self.launchBehaviours(channels);
        });
    };

    self.getClient = function(channels) {
        self.client = new tmi.client({
            options: { debug: true },
            connection: {
                cluster: 'aws',
                reconnect: true
            },
            identity: {
                username: config.twitch.name,
                password: config.twitch.auth_key
            },
            channels: channels
        });
    };

    self.launchBehaviours = function(channels) {
        var chat_modules = [];

        for (var behaviour in config.behaviours) {
            var config_behaviour = config.behaviours[behaviour];

            var module = require('./' + config_behaviour.module + '.js');
            if (config_behaviour.enabled) {
                chat_modules.push(module.init(config_behaviour.config));
            }
        }

        self.client.on('chat', function(channel, userstate, message) {
            var username = userstate['display-name'];

            chat_modules.forEach(instance => {
                instance.handle(self.client, channel, username, message);
            });
        });

        self.client.on('connected', function(address, port) {
            channels.forEach(_ => self.client.say(_, 'Hey there! HeyGuys'));
        });
    };

    return self.init();
};

module.exports = {
    run: function() {
        new Bot();
    }
};

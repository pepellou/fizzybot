var tmi = require('tmi.js');
var config = require('./config.js'),
    cors = require('cors'),
    express = require('express'),
    app = express();

const PORT = process.env.PORT || 3000;

var bad_words_timeout_seconds = 120;

var channels = [
    'pepellou',
    'joannatries'
];

var options = {
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
};

var client = new tmi.client(options);
client.connect();

var chat_modules = [];

for (var behaviour in config.behaviours) {
    var config_behaviour = config.behaviours[behaviour];

    var module = require('./' + config_behaviour.module + '.js');
    if (config_behaviour.enabled) {
        chat_modules.push(module.init(config_behaviour.config));
    }
}

client.on('chat', function(channel, userstate, message, self) {
    var username = userstate['display-name'];

    chat_modules.forEach(instance => {
        instance.handle(client, channel, username, message);
    });
});

client.on('connected', function(address, port) {
    channels.forEach(_ => client.say(_, 'Hey there! HeyGuys'));
});


app.use(cors());

app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});


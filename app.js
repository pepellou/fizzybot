var tmi = require('tmi.js');

var bad_words_timeout_seconds = 120;

var channels = [ 'pepellou' ];

var options = {
    options: { debug: true },
    connection: {
        cluster: 'aws',
        reconnect: true
    },
    identity: {
        username: 'FizzyWaterBot',
        password: 'oauth:xnlat2g4w66653tpqesuplnvs4pcbe'
    },
    channels: channels
};

var client = new tmi.client(options);
client.connect();

var bad_words = [
    'fuck',
    'fuckk',
    'fuckkk',
    'fuckkkk',
    'fuckkkkk',
    'fuckkkkkk',
    'ffuck',
    'mor0n',
    'm0ron',
    'm0r0n',
    'moron'
];

var bad_words_strikes = { };

client.on('chat', function(channel, userstate, message, self) {
    var username = userstate['display-name'];
    if (message
        .toLowerCase()
        .split('')
        .filter(_ => (_ == ' ') || (_ >= '0' && _ <= '9') || (_ >= 'a' && _ <= 'z') )
        .join('')
        .split(' ')
        .some(_ => bad_words.includes(_))
    ) {
        if (!bad_words_strikes[username]) {
            bad_words_strikes[username] = 0;
        }
        bad_words_strikes[username]++;
        var strikes = bad_words_strikes[username];
        if (strikes < 3) {
            client.say(channel, 'grrrr @' + username + ', this is your strike number ' + strikes + '. With 3 strikes you\'ll be timed out.');
        } else {
            client.say(channel, 'grrrr @' + username + ', this was your strike number ' + strikes + '. You are timed out.');
            client.timeout(channel, username, bad_words_timeout_seconds, "Using bad words");
            bad_words_strikes[username] = 0;
        }
    }
});

client.on('connected', function(address, port) {
    channels.forEach(_ => client.say(_, 'Hey there! HeyGuys'));
});

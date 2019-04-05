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

var handleBadWords = function(client, channel, username, message) {
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
};

var current_poll = {
    active: false,
    votes: {}
};

var handlePoll = function(client, channel, username, message) {
    // TODO: allow mods to create polls

    if (!current_poll.active) {
        if (username == channel || message.substring(0, 5) == '!poll') {
            var poll_data = message.substring(5)
                .split('/')
                .map(_ => _.trim());
            current_poll.question = poll_data.shift();
            current_poll.answers = poll_data;
            current_poll.active = true;
            client.say(channel, "CurseLit 🄷🄾🅃 🄽🄴🅆 🄿🄾🄻🄻 CurseLit");
            client.say(channel, current_poll.question + "(type your answer in the chat)");
            current_poll.answers.forEach((answer, i) => {
                client.say(channel, "type " + (i+1) + " for \"" + answer + "\"");
            });
        }
        return;
    } else if (username == channel || message == '!endpoll') {
        client.say(channel, "Poll closed:");

        var votes = Object.values(current_poll.votes);
        var num_votes = votes.length;

        var results = current_poll.answers
            .map((answer, i) => ({
                text: answer,
                pct:  (num_votes == 0 ? 0 : 100 * votes.filter(_ => _ == (i+1)).length / num_votes)
            }))
            .sort((a, b) => b.pct - a.pct);

        results.forEach(result => {
            client.say(channel, result.pct.toFixed(2) + "% - " + result.text);
        });

        // TODO: bar chart for results

        current_poll.active = {
            active: false,
            votes: {}
        };
    }

    current_poll.answers.forEach((answer, i) => {
        if (message == "" + (i + 1)) {
            current_poll.votes[username] = (i + 1);
        }
    });
};

client.on('chat', function(channel, userstate, message, self) {
    var username = userstate['display-name'];

    handleBadWords(client, channel, username, message);
    handlePoll(client, channel, username, message);
});

client.on('connected', function(address, port) {
    channels.forEach(_ => client.say(_, 'Hey there! HeyGuys'));
});

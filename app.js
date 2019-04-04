var tmi = require('tmi.js');

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

client.on('connected', function(address, port) {
    channels.forEach(_ => client.say(_, 'Hey there! HeyGuys'));
});

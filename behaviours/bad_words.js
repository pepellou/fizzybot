function BadWordsDetector(options) {
    var self = this;

    // default values
    self._bad_words      = [ 'fuck' ];
    self._max_strikes    = 3;
    self._timeout_amount = 120;
    self._messages       = {
        strike: 'grrrr, this is your strike number #{strikes}. With #{max_strikes} strikes you\'ll be timed out.',
        timeout: 'grrrr, this is your strike number #{strikes}. You are timed out.'
    };

    self._bad_words_strikes = { };

    self.init = function(options) {
        self._bad_words      = options.bad_words      ? options.bad_words      : self._bad_words;
        self._max_strikes    = options.max_strikes    ? options.max_strikes    : self._max_strikes;
        self._timeout_amount = options.timeout_amount ? options.timeout_amount : self._timeout_amount;
        self._messages       = options.messages       ? options.messages       : self._messages;

        if (self._timeout_amount.length) {
            self._timeout_amount = self._timeout_amount[0];
        }

        return self;
    };

    self.handle = function(client, channel, username, message) {
        if (message
            .toLowerCase()
            .split('')
            .filter(_ => (_ == ' ') || (_ >= '0' && _ <= '9') || (_ >= 'a' && _ <= 'z') )
            .join('')
            .split(' ')
            .some(_ => self._bad_words.includes(_))
        ) {
            if (!self._bad_words_strikes[username]) {
                self._bad_words_strikes[username] = 0;
            }
            self._bad_words_strikes[username]++;
            var strikes = self._bad_words_strikes[username];
            if (self._max_strikes < 0 || strikes < self._max_strikes) {
                client.say(
                    channel,
                    '@' + username + ' ' + self._messages.strike
                        .replace('#{strikes}', strikes)
                        .replace('#{max_strikes}', self._max_strikes)
                );
            } else {
                client.say(
                    channel,
                    '@' + username + ' ' + self._messages.timeout
                        .replace('#{strikes}', strikes)
                        .replace('#{max_strikes}', self._max_strikes)
                );
                client.timeout(channel, username, self._timeout_amount, "Using bad words");
                self._bad_words_strikes[username] = 0;
            }
        }
    };

    return self.init(options);
}

module.exports = {
    name: 'Bad Words Detection',
    description: 'Detects some words and gives strikes to the user',
    init: function(options) {
        return new BadWordsDetector(options);
    }
};

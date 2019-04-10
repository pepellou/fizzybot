function PollMaker(options) {
    var self = this;

    self._current_poll = {
        active: false,
        votes: {}
    };

    self.init = function(options) {
        return self;
    };

    self.handle = function(client, channel, username, message) {
        // TODO: allow mods to create polls

        if (!self._current_poll.active) {
            if (username == channel || message.substring(0, 5) == '!poll') {
                var poll_data = message.substring(5)
                    .split('/')
                    .map(_ => _.trim());
                self._current_poll.question = poll_data.shift();
                self._current_poll.answers = poll_data;
                self._current_poll.active = true;
                client.say(channel, "CurseLit 🄷🄾🅃 🄽🄴🅆 🄿🄾🄻🄻 CurseLit");
                client.say(channel, self._current_poll.question + "(type your answer in the chat)");
                self._current_poll.answers.forEach((answer, i) => {
                    client.say(channel, "type " + (i+1) + " for \"" + answer + "\"");
                });
            }
            return;
        } else if (username == channel || message == '!endpoll') {
            client.say(channel, "Poll closed:");

            var votes = Object.values(self._current_poll.votes);
            var num_votes = votes.length;

            var results = self._current_poll.answers
                .map((answer, i) => ({
                    text: answer,
                    pct:  (num_votes == 0 ? 0 : 100 * votes.filter(_ => _ == (i+1)).length / num_votes)
                }))
                .sort((a, b) => b.pct - a.pct);

            results.forEach(result => {
                client.say(channel, result.pct.toFixed(2) + "% - " + result.text);
            });

            // TODO: bar chart for results

            self._current_poll.active = {
                active: false,
                votes: {}
            };
        }

        self._current_poll.answers.forEach((answer, i) => {
            if (message == "" + (i + 1)) {
                self._current_poll.votes[username] = (i + 1);
            }
        });
    };

    return self.init(options);
}

module.exports = {
    name: 'Poll Maker',
    description: 'Allows broadcaster to create polls in chat',
    init: function(options) {
        return new PollMaker(options);
    }
};

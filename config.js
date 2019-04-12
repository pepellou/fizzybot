module.exports = {

    twitch: {
        name: 'FizzyWaterBot',
        auth_key: process.env.twitch_app_oauth_key
    },

    behaviours: {

        bad_words_detector: {
            enabled: true,
            module: 'behaviours/bad_words',
            config: {
                bad_words: [
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
                ],
                max_strikes: 3,
                timeout_amount: [ 120, 300, 600 ],
                messages: {
                    strike: 'grrrr, this is your strike number #{strikes}. With #{max_strikes} strikes you\'ll be timed out.',
                    timeout: 'grrrr, this is your strike number #{strikes}. You are timed out.'
                }
            }
        },

        johanna_detector: {
            enabled: true,
            module: 'behaviours/bad_words',
            config: {
                bad_words: [
                    'Johanna',
                    'johanna'
                ],
                max_strikes: 1, //Number.MAX_SAFE_INTEGER,
                timeout_amount: 120,
                messages: {
                    strike: 'grrrr, it\'s Joanna!! This is your strike number #{strikes}.',
                    timeout: 'grrrr, it\'s Joanna!! You are timed out.'
                }
            }
        },

        poll_maker: {
            enabled: true,
            module: 'behaviours/poll',
            config: {}
        }

    }

};

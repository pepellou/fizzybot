var mysql = require('mysql');

var DB = function() {
    var self = this;

    self.init = function() {
        self._db = mysql.createConnection(process.env.JAWSDB_URL);
        self._query = function(query, mapping, cb) {
            self._db.connect();
            self._db.query(query, function(err, rows, fields) {
                if (err) throw err;
                cb(rows.map(mapping));
            });
            self._db.end();
        };
    };

    self.getChannels = function(cb) {
        self._query('SELECT name FROM channel', _ => _.name, cb);
    };

    return self.init();
}

module.exports = new DB();

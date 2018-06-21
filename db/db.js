const Datastore = require('nedb');
const DB_KEY = Symbol.for("singleton.DB");

// check if the global object has this symbol
// add it if it does not have the symbol, yet
// ------------------------------------------

var globalSymbols = Object.getOwnPropertySymbols(global);
var hasDb = (globalSymbols.indexOf(DB_KEY) > -1);

class DB {
    constructor() {
        this.photoDB = new Datastore({
            filename: __dirname + '/../data/photoDB.db',
            autoload: true
        });

        this.indexDB = new Datastore({
            filename: __dirname + '/../data/indexDB.db',
            autoload: true
        });
    }

    static getInstance() {
        return global[DB_KEY];
    }
}


if (!hasDb){
    global[DB_KEY] = new DB();
}

module.exports = DB;
const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.notes = require("./notes.model.js")(mongoose);
db.books_info = require("./books_info.model.js")(mongoose);
db.books_content = require("./books_content.model.js")(mongoose);
db.chapters = require("./chapters.model.js")(mongoose);
db.pages = require("./pages.model.js")(mongoose);
db.users = require("./users.model.js")(mongoose);
db.user_books = require("./user_books.model.js")(mongoose);
module.exports = db;

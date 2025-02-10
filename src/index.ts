import * as admin from "firebase-admin";

admin.initializeApp();

exports.history = require("./historyFunc");

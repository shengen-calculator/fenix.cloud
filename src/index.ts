import * as admin from "firebase-admin";

admin.initializeApp();

exports.history = require("./historyFunc");
exports.statistic = require("./statisticFunc");
exports.main = require("./mainFunc");

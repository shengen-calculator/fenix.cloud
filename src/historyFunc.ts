import {authDecorator} from "./authDecorator";
import {getPayments} from "./history/getPayments";
import {getSales} from "./history/getSales";
import {getReturns} from "./history/getReturns";

exports.getPayments = authDecorator(getPayments,
    ["ADMIN", "MANAGER", "CLIENT"]);
exports.getSales = authDecorator(getSales,
    ["ADMIN", "MANAGER", "CLIENT"]);
exports.getReturns = authDecorator(getReturns,
    ["ADMIN", "MANAGER", "CLIENT"]);

import {authDecorator} from "./authDecorator";
import {getPayments} from "./history/getPayments";

exports.getPayments = authDecorator(getPayments,
    ["ADMIN", "MANAGER", "CLIENT"]);

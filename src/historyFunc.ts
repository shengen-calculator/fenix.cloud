import {authDecorator} from "./authDecorator";
import {getPayments} from "./history/getPayments";
import {getSales} from "./history/getSales";
import {getReturns} from "./history/getReturns";
import {ROLE} from "./role";

exports.getPayments = authDecorator(getPayments,
    [ROLE.ADMIN, ROLE.MANAGER, ROLE.CLIENT]);
exports.getSales = authDecorator(getSales,
    [ROLE.ADMIN, ROLE.MANAGER, ROLE.CLIENT]);
exports.getReturns = authDecorator(getReturns,
    [ROLE.ADMIN, ROLE.MANAGER, ROLE.CLIENT]);

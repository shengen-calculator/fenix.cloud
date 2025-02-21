import {authDecorator} from "./authDecorator";
import {getAnalogs} from "./search/getAnalogs";
import {ROLE} from "./role";

exports.getPayments = authDecorator(getAnalogs,
    [ROLE.ADMIN, ROLE.MANAGER]);

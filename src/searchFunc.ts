import {getReconciliationData} from "./main/getReconciliationData";
import {getAnalogs} from "./search/getAnalogs";
import {authDecorator} from "./authDecorator";
import {ROLE} from "./role";

exports.getAnalogs = authDecorator(getAnalogs,
    [ROLE.ADMIN, ROLE.MANAGER]);
exports.getReconciliationData = authDecorator(getReconciliationData,
    [ROLE.ADMIN, ROLE.MANAGER, ROLE.CLIENT])
import {authDecorator} from "./authDecorator";
import {getAnalogs} from "./search/getAnalogs";
import {ROLE} from "./role";

exports.getAnalogs = authDecorator(getAnalogs,
    [ROLE.ADMIN, ROLE.MANAGER]);

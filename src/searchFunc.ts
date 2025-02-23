import {getAnalogs} from "./search/getAnalogs";
import {authDecorator} from "./authDecorator";
import {ROLE} from "./role";

exports.getAnalogs = authDecorator(getAnalogs,
    [ROLE.ADMIN, ROLE.MANAGER]);

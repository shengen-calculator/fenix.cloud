import {deleteReservesByIds} from "./order/deleteReservesByIds";
import {deleteOrdersByIds} from "./order/deleteOrdersByIds";
import {getReservesByVip} from "./order/getReservesByVip";
import {getOrdersByVip} from "./order/getOrdersByVip";
import {authDecorator} from "./authDecorator";
import {ROLE} from "./role";

exports.getReservesByVip = authDecorator(getReservesByVip,
    [ROLE.ADMIN, ROLE.MANAGER, ROLE.CLIENT]);
exports.getOrdersByVip = authDecorator(getOrdersByVip,
    [ROLE.ADMIN, ROLE.MANAGER, ROLE.CLIENT]);
exports.deleteReservesByIds = authDecorator(deleteReservesByIds,
    [ROLE.ADMIN, ROLE.MANAGER]);
exports.deleteOrdersByIds = authDecorator(deleteOrdersByIds,
    [ROLE.ADMIN, ROLE.MANAGER]);

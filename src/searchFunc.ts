import {getAnalogs} from "./search/getAnalogs";
import {getPhotos} from "./search/getPhotos";
import {authDecorator} from "./authDecorator";
import {updatePrice} from "./search/updatePrice";
import {searchByNumber} from "./search/searchByNumber";
import {getDeliveryDate} from "./search/getDeliveryDate";
import {searchByBrandAndNumber} from "./search/searchByBrandAndNumber";
import {ROLE} from "./role";

exports.getAnalogs = authDecorator(getAnalogs,
    [ROLE.ADMIN, ROLE.MANAGER]);
exports.getPhotos = authDecorator(getPhotos,
    [ROLE.ADMIN, ROLE.MANAGER, ROLE.CLIENT]);
exports.searchByNumber = authDecorator(searchByNumber,
    [ROLE.ADMIN, ROLE.MANAGER, ROLE.CLIENT]);
exports.searchByBrandAndNumber = authDecorator(searchByBrandAndNumber,
    [ROLE.ADMIN, ROLE.MANAGER, ROLE.CLIENT]);
exports.getDeliveryDate = authDecorator(getDeliveryDate,
    [ROLE.ADMIN, ROLE.MANAGER, ROLE.CLIENT]);
exports.updatePrice = authDecorator(updatePrice,
    [ROLE.ADMIN, ROLE.MANAGER]);

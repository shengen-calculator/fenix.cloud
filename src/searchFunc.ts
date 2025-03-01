import {getAnalogs} from "./search/getAnalogs";
import {getPhotos} from "./search/getPhotos";
import {authDecorator} from "./authDecorator";
import {searchByNumber} from "./search/searchByNumber";
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

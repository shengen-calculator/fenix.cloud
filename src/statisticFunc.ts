import {authDecorator} from "./authDecorator";
import {getVendorStatistic} from "./statistic/getVendorStatistic";
import {getClientStatistic} from "./statistic/getClientStatistic";
import {getStatisticByVendor} from "./statistic/getStatisticByVendor";
import {ROLE} from "./role";

exports.getVendorStatistic = authDecorator(getVendorStatistic,
    [ROLE.ADMIN, ROLE.MANAGER]);
exports.getStatisticByVendor = authDecorator(getStatisticByVendor,
    [ROLE.ADMIN, ROLE.MANAGER]);
exports.getClientStatistic = authDecorator(getClientStatistic,
    [ROLE.ADMIN, ROLE.MANAGER]);

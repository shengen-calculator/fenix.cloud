import {authDecorator} from "./authDecorator";
import {getClientByVip} from "./main/getClientByVip";
import {getCurrencyRate} from "./main/getCurrencyRate";
import {getPaymentsByVip} from "./main/getPaymentsByVip";
import {getReconciliationData} from "./main/getReconciliationData";
import {ROLE} from "./role";

exports.getClientByVip = authDecorator(getClientByVip,
    [ROLE.ADMIN, ROLE.MANAGER, ROLE.CLIENT]);
exports.getCurrencyRate = authDecorator(getCurrencyRate,
    [ROLE.ADMIN, ROLE.MANAGER, ROLE.CLIENT]);
exports.getPaymentsByVip = authDecorator(getPaymentsByVip,
    [ROLE.ADMIN, ROLE.MANAGER, ROLE.CLIENT]);
exports.getReconciliationData = authDecorator(getReconciliationData,
    [ROLE.ADMIN, ROLE.MANAGER, ROLE.CLIENT]);

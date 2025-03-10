import {
    beforeUserCreated,
    beforeUserSignedIn,
} from "firebase-functions/v2/identity";
import {defineString} from "firebase-functions/params";
import {authDecorator} from "./authDecorator";
import {beforeCreate} from "./main/beforeCreate";
import {beforeSignIn} from "./main/beforeSignIn";
import {getClientByVip} from "./main/getClientByVip";
import {getCurrencyRate} from "./main/getCurrencyRate";
import {getPaymentsByVip} from "./main/getPaymentsByVip";
import {getReconciliationData} from "./main/getReconciliationData";
import {getUnblockRecords} from "./main/getUnblockRecords";
import {unblockClient} from "./main/unblockClient";
import {ROLE} from "./role";
import {FUNC_REGION, SERVICE_ACCOUNT} from "./constants";

exports.getClientByVip = authDecorator(getClientByVip,
    [ROLE.ADMIN, ROLE.MANAGER, ROLE.CLIENT]);
exports.getCurrencyRate = authDecorator(getCurrencyRate,
    [ROLE.ADMIN, ROLE.MANAGER, ROLE.CLIENT]);
exports.getPaymentsByVip = authDecorator(getPaymentsByVip,
    [ROLE.ADMIN, ROLE.MANAGER, ROLE.CLIENT]);
exports.getReconciliationData = authDecorator(getReconciliationData,
    [ROLE.ADMIN, ROLE.MANAGER, ROLE.CLIENT]);
exports.getUnblockRecords = authDecorator(getUnblockRecords,
    [ROLE.ADMIN]);
exports.unblockClient = authDecorator(unblockClient,
    [ROLE.ADMIN]);
exports.beforeCreate = beforeUserCreated({
    region: defineString(FUNC_REGION),
    serviceAccount: defineString(SERVICE_ACCOUNT),
}, (event) => {
    return beforeCreate(event.data);
});
exports.beforeSignIn = beforeUserSignedIn({
    region: defineString(FUNC_REGION),
    serviceAccount: defineString(SERVICE_ACCOUNT),
}, (event) => {
    return beforeSignIn(event.data);
});

import {onCall, HttpsError} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {CallableRequest} from "firebase-functions/lib/common/providers/https";
import {defineString} from "firebase-functions/params";
import {FUNC_REGION, SERVICE_ACCOUNT} from "./constants";
import {ROLE} from "./role";

export const authDecorator =
    (fn: (...args: any[]) => any, roles: ROLE[]) =>
        onCall({
            region: defineString(FUNC_REGION),
            serviceAccount: defineString(SERVICE_ACCOUNT),
        }, (request: any) => {
            return decorated(fn(request), roles, request);
        });


const decorated = (wrapped: Promise<any>, roles: ROLE[],
                   request: CallableRequest) => {
    const wrapper = (request: CallableRequest) => {
        if (!process.env.FUNCTIONS_EMULATOR) {
            logger.info(request.auth?.token);
            if (!request.auth) {
                throw new HttpsError("failed-precondition",
                    "The function must be called while authenticated.");
            } else if (!~roles.indexOf(request.auth?.token?.["role"] as ROLE)) {
                throw new HttpsError("failed-precondition",
                    `Only ${roles.map((i) => ROLE[i])} can call this function`);
            }
        }
        return wrapped;
    };
    return wrapper(request);
};

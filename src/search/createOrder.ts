import * as sql from "mssql";
import {HttpsError} from "firebase-functions/v2/https";
import {CallableRequest} from "firebase-functions/lib/common/providers/https";
import SqlHelper from "../SqlHelper";
import DebtService from "./DebtService";
import {SP_ADD_ORDER} from "./searchQueries";

export const createOrder = async (request: CallableRequest) => {
    const input: CreateOrderInput = request.data;
    const clientId = SqlHelper.getClientId(input.clientId, request.auth);
    const vip = SqlHelper.getUserVip({
        vip: input.vip,
    }, request.auth);
    const debtService = new DebtService(clientId);
    if (await debtService.isClientBlocked()) {
        throw new HttpsError("failed-precondition",
            "User account is blocked. Please contact administrator.");
    }

    const sqlHelper = new SqlHelper();
    const pool = await sqlHelper.getPool();
    const addOrderRequest = sqlHelper.createPoolRequest(pool, [
        {
            name: "clientId",
            type: sql.Int,
            value: clientId,
        },
        {
            name: "productId",
            type: sql.Int,
            value: input.productId,
        },
        {
            name: "price",
            // eslint-disable-next-line new-cap
            type: sql.Decimal(9, 2),
            value: input.price ? input.price : 0,
        },
        {
            name: "isEuroClient",
            type: sql.Bit,
            value: input.isEuroClient,
        },
        {
            name: "quantity",
            type: sql.Int,
            value: input.quantity,
        },
        {
            name: "onlyOrderedQuantity",
            type: sql.Bit,
            value: input.onlyOrderedQuantity,
        },
        {
            name: "currentUser",
            // eslint-disable-next-line new-cap
            type: sql.VarChar(20),
            value: vip,
        },
    ], SP_ADD_ORDER, true);
    const [order] = await sqlHelper.sendRequests([addOrderRequest]);
    return {
        rowsAffected: order.rowsAffected,
    };
};

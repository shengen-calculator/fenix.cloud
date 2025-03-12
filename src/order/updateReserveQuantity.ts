import * as sql from "mssql";
import {CallableRequest} from "firebase-functions/lib/common/providers/https";
import SqlHelper from "../SqlHelper";
import {SP_UPDATE_RESERVE} from "./orderQueries";

export const updateReserveQuantity = async (request: CallableRequest) => {
    const input: UpdateReserveInput = request.data;
    const sqlHelper = new SqlHelper();
    const pool = await sqlHelper.getPool();
    const updateReserveRequest = sqlHelper.createPoolRequest(pool, [
        {
            name: "reserveId",
            type: sql.Int,
            value: input.reserveId,
        },
        {
            name: "productId",
            type: sql.Int,
            value: input.productId,
        },
        {
            name: "quantity",
            type: sql.Int,
            value: input.quantity,
        },
    ], SP_UPDATE_RESERVE, true);
    const [reserve] = await sqlHelper.sendRequests([updateReserveRequest]);
    return {
        rowsAffected: reserve.rowsAffected,
    };
};

import * as format from "string-template";
import {CallableRequest} from "firebase-functions/lib/common/providers/https";
import SqlHelper from "../SqlHelper";
import {UPDATE_ORDER} from "./orderQueries";

export const updateOrderQuantity = async (request: CallableRequest) => {
    const input: UpdateOrderInput = request.data;
    const sqlHelper = new SqlHelper(format(UPDATE_ORDER, {
        quantity: input.quantity,
        orderId: input.orderId,
    }));
    const sqlResponse = await sqlHelper.sendQuery();
    return {
        rowsAffected: sqlResponse.rowsAffected,
    };
};

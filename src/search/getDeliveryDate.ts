import * as format from "string-template";
import {CallableRequest} from "firebase-functions/lib/common/providers/https";
import SqlHelper from "../SqlHelper";
import {GET_DELIVERY_DATE} from "./searchQueries";

export const getDeliveryDate = async (request: CallableRequest) => {
    const input: GetDeliveryDateInput = request.data;
    const sqlHelper = new SqlHelper(format(GET_DELIVERY_DATE, {
        term: input.term,
        productId: input.productId,
    }));
    const sqlResponse = await sqlHelper.sendQuery();
    return sqlResponse.recordset.pop();
};

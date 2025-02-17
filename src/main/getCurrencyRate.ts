import {CallableRequest} from "firebase-functions/lib/common/providers/https";
import {GET_CURRENCY_RATE} from "./mainQueries";
import SqlHelper from "../SqlHelper";

export const getCurrencyRate = async (request: CallableRequest) => {
    const sqlHelper = new SqlHelper(GET_CURRENCY_RATE);
    const sqlResponse = await sqlHelper.sendQuery();
    return sqlResponse.recordset;
};

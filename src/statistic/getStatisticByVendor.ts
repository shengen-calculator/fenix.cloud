import {CallableRequest} from "firebase-functions/lib/common/providers/https";
import * as format from "string-template";
import {HttpsError} from "firebase-functions/v2/https";
import {GET_STATISTICS_BY_VENDOR} from "./statisticQueries";
import SqlHelper from "../SqlHelper";

export const getStatisticByVendor = async (request: CallableRequest) => {
    const vendorId = request.data;
    if (!vendorId || isNaN(vendorId)) {
        throw new HttpsError("invalid-argument",
            "The function must be called with one argument 'vendorId'");
    }
    const sqlQuery = format(GET_STATISTICS_BY_VENDOR, {
        vendorId,
    });
    const sqlHelper = new SqlHelper(sqlQuery);
    const sqlResponse = await sqlHelper.sendQuery();
    return sqlResponse.recordset;
};

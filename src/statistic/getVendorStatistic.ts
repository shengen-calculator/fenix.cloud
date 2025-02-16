import {CallableRequest} from "firebase-functions/lib/common/providers/https";
import SqlHelper from "../SqlHelper";
import {GET_VENDOR_STATISTIC} from "./statisticQueries";

export const getVendorStatistic = async (request: CallableRequest) => {
    const sqlHelper = new SqlHelper(GET_VENDOR_STATISTIC);
    const sqlResponse = await sqlHelper.sendQuery();
    return sqlResponse.recordset;
};

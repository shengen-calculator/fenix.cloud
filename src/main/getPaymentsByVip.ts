import * as format from "string-template";
import {CallableRequest} from "firebase-functions/lib/common/providers/https";
import {GET_CLIENT_INFO, GET_CLIENT_PAYMENTS} from "./mainQueries";
import SqlHelper from "../SqlHelper";

export const getPaymentsByVip = async (request: CallableRequest) => {
    const vip = request.data;
    const sqlGetClientQuery = format(GET_CLIENT_INFO, {
        vip: SqlHelper.getUserVip({
            vip,
        }, request.auth),
    });
    const sqlGetClientHelper = new SqlHelper(sqlGetClientQuery);
    const sqlGetClientResponse = await sqlGetClientHelper.sendQuery();
    const debtInfo: DebtInfo = sqlGetClientResponse.recordset.pop();
    const sqlGetPaymentsQuery = format(GET_CLIENT_PAYMENTS, {
        id: debtInfo.id,
        days: debtInfo.days,
    });
    const sqlGetPaymentsHelper = new SqlHelper(sqlGetPaymentsQuery);
    const sqlGetPaymentsResponse = await sqlGetPaymentsHelper.sendQuery();
    return sqlGetPaymentsResponse.recordset;
};

import * as format from "string-template";
import {CallableRequest} from "firebase-functions/lib/common/providers/https";
import {GET_CLIENT} from "./mainQueries";
import SqlHelper from "../SqlHelper";

export const getClientByVip = async (request: CallableRequest) => {
    const vip = request.data;
    const sqlQuery = format(GET_CLIENT, {
        vip: SqlHelper.getUserVip({
            vip,
        }, request.auth)
    });
    const sqlHelper = new SqlHelper(sqlQuery);
    const sqlResponse = await sqlHelper.sendQuery();
    return sqlResponse.recordset;
}

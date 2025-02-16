import * as format from "string-template";
import {GET_CLIENT_RETURNS} from "./historyQueries";
import SqlHelper from "../SqlHelper";
import {CallableRequest} from "firebase-functions/lib/common/providers/https";

export const getReturns = async (request: CallableRequest) => {
    const data: GetReturnsInput = request.data;
    const sqlQuery = format(GET_CLIENT_RETURNS, {
        vip: SqlHelper.getUserVip(data, request.auth),
        rows: data.rows && data.rows < 101 ? data.rows : 10,
        offset: data.offset ? data.offset : 0,
    });
    const sqlHelper = new SqlHelper(sqlQuery);
    const sqlResponse = await sqlHelper.sendQuery();
    return sqlResponse.recordset;
};

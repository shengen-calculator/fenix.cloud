import * as format from "string-template";
import {CallableRequest} from "firebase-functions/lib/common/providers/https";
import SqlHelper from "../SqlHelper";
import {GET_ORDERS} from "./orderQueries";

export const getOrdersByVip = async (request: CallableRequest) => {
    const vip = request.data;
    const sqlHelper = new SqlHelper(format(GET_ORDERS, {
            vip: SqlHelper.getUserVip({
                vip,
            }, request.auth),
        })
    );

    const sqlResponse = await sqlHelper.sendQuery();
    if (SqlHelper.isClient(request.auth)) {
        sqlResponse.recordset.forEach((reserve) => {
            delete reserve["vendor"];
            delete reserve["note"];
        });
    }
    return sqlResponse.recordset;
};

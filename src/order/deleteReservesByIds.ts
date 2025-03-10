import * as format from "string-template";
import {CallableRequest} from "firebase-functions/lib/common/providers/https";
import SqlHelper from "../SqlHelper";
import {DELETE_RESERVES} from "./orderQueries";

export const deleteReservesByIds = async (request: CallableRequest) => {
    const ids: Array<number> = request.data;
    const sqlHelper = new SqlHelper(format(DELETE_RESERVES, {ids}));
    const sqlResponse = await sqlHelper.sendQuery();
    return {
        rowsAffected: sqlResponse.rowsAffected,
    };
};

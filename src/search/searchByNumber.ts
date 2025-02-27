import * as format from "string-template";
import {CallableRequest} from "firebase-functions/lib/common/providers/https";
import {Datastore} from "@google-cloud/datastore";
import {GET_PARTS_BY_NUMBER} from "./searchQueries";
import SqlHelper from "../SqlHelper";
import DatastoreHelper from "../DatastoreHelper";

export const searchByNumber = async (request: CallableRequest) => {
    let number = request.data;
    // eslint-disable-next-line max-len, quotes
    const special = ["@", "#", "_", "&", "-", "+", "(", ")", "/", "*", '"', "'", ":", ";", "!", "?", "=", "[", "]", "©", "|", "\\", "%", " "];
    special.forEach((el) => {
        const tokens = number.split(el);
        number = tokens.join("");
    });
    const sqlQuery = format(GET_PARTS_BY_NUMBER, {
        number,
    });
    const sqlHelper = new SqlHelper(sqlQuery);
    const sqlResponse = await sqlHelper.sendQuery();
    if (SqlHelper.isClient(request.auth)) {
        const datastore = new Datastore();
        const datastoreHelper = new DatastoreHelper(datastore);
        const entityKey = datastore.key("queries");
        await datastoreHelper.insertEntity({
            key: entityKey,
            data: {
                date: new Date(),
                query: number,
                success: sqlResponse.recordset.length > 0,
                vip: SqlHelper.getUserVip({
                    vip: "",
                }, request.auth),
            },
        });

        return sqlResponse.recordset.map((rec) => ({
            ...rec,
            queryId: entityKey.id,
        }));
    }
    return sqlResponse.recordset;
};

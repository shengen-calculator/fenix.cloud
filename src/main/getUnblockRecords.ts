import {CallableRequest} from "firebase-functions/lib/common/providers/https";
import {Datastore} from "@google-cloud/datastore";
import DatastoreHelper from "../DatastoreHelper";

export const getUnblockRecords = async (request: CallableRequest) => {
    const vip = request.data;
    const datastore = new Datastore();
    const query = datastore
        .createQuery("unblock-records")
        .filter("vip", "=", vip)
        .order("date", {
            descending: true,
        })
        .limit(10);
    const datastoreHelper = new DatastoreHelper(datastore);
    const [entities] = await datastoreHelper
        .runQuery(query) as [UnblockRecord[]];
    return entities.map((entity) => {
        return {
            date: entity.date.getTime(),
            user: entity.email,
        };
    });
};

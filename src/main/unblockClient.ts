import {CallableRequest} from "firebase-functions/lib/common/providers/https";
import {HttpsError} from "firebase-functions/v2/https";
import {Datastore} from "@google-cloud/datastore";
import DatastoreHelper from "../DatastoreHelper";

export const unblockClient = async (request: CallableRequest) => {
    const vip = request.data;
    const datastore = new Datastore();
    const currentDate = new Date();
    const query = datastore
        .createQuery("unblock-records")
        .filter("vip", "=", vip)
        .order("date", {
            descending: true,
        })
        .limit(1);
    const datastoreHelper = new DatastoreHelper(query, datastore);
    const [entities] = await datastoreHelper.runQuery() as [UnblockRecord[]];
    const recordDate = entities.pop()?.date;

    // Check if the user is already unblocked today
    if (recordDate &&
        recordDate.getFullYear() === currentDate.getFullYear() &&
        recordDate.getMonth() === currentDate.getMonth() &&
        recordDate.getDate() === currentDate.getDate()) {
        throw new HttpsError("invalid-argument", "Client is already unblocked");
    }

    const entityKey = datastore.key("unblock-records");
    await datastoreHelper.insertEntity({
        key: entityKey,
        data: {
            vip,
            date: currentDate,
            email: request.auth?.token?.["email"] || "Unknown",
        },
    });
};

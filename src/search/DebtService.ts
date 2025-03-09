import * as format from "string-template";
import {Datastore} from "@google-cloud/datastore";
import SqlHelper from "../SqlHelper";
import DatastoreHelper from "../DatastoreHelper";
import {GET_CLIENT_DEBT} from "./searchQueries";

/**
 * Debt Service
 */
export default class DebtService {
    readonly clientId: number;
    readonly currentDate: Date;
    readonly dataStore: Datastore;

    /**
     * Service constructor
     * @param {number} clientId
     * @param {Datastore} dataStore
     */
    constructor(clientId: number, dataStore?: Datastore) {
        this.clientId = clientId;
        this.currentDate = new Date();
        this.dataStore = dataStore ? dataStore :
            new Datastore();
    }

    /**
     * Check whether client is blocked or not
     */
    public async isClientBlocked(): Promise<boolean> {
        const sqlHelper = new SqlHelper(format(GET_CLIENT_DEBT, {
            clientId: this.clientId,
        }));
        const sqlResponse = await sqlHelper.sendQuery();
        const debtRecord: ClientDebt = sqlResponse.recordset.pop();
        if (Math.sign(debtRecord?.overdueDebt || 0) !== 1) {
            return false;
        }


        const storeQuery = this.dataStore
            .createQuery("unblock-records")
            .filter("vip", "=", debtRecord.vip.trimEnd())
            .order("date", {
                descending: true,
            })
            .limit(1);
        const datastoreHelper = new DatastoreHelper(this.dataStore);
        const [entities] = await datastoreHelper
            .runQuery(storeQuery) as [UnblockRecord[]];

        if (!entities.length) {
            return true;
        }
        const recordDate = entities.pop()?.date;

        return recordDate?.getFullYear() !== this.currentDate.getFullYear() ||
            recordDate?.getMonth() !== this.currentDate.getMonth() ||
            recordDate?.getDate() !== this.currentDate.getDate();
    }
}

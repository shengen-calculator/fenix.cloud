import {HttpsError} from "firebase-functions/v2/https";
import {
    Datastore,
    InsertResponse,
    Query,
} from "@google-cloud/datastore";

/**
 * Can help get data from Firestore
 */
export default class DatastoreHelper {
    readonly query: Query;
    readonly datastore: Datastore;

    /**
     * Helper constructor
     * @param {Query} query
     * @param {Datastore} datastore
     */
    constructor(query: Query, datastore: Datastore) {
        this.query = query;
        this.datastore = datastore;
    }

    /**
     * Run query on Firestore
     */
    public async runQuery(): Promise<any> {
        try {
            return await this.datastore.runQuery(this.query);
        } catch (err: any) {
            throw new HttpsError("internal",
                err.details || "Unknown error occurred");
        }
    }

    /**
     * Save entity to Firestore
     * @param {any} entity
     */
    public async insertEntity(entity: any): Promise<InsertResponse> {
        try {
            return await this.datastore.insert(entity);
        } catch (err: any) {
            throw new HttpsError("internal",
                err.details || "Unknown error occurred");
        }
    }
}

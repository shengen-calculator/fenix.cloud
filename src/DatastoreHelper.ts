import {HttpsError} from "firebase-functions/v2/https";
import {
    Datastore,
    InsertResponse,
    UpdateResponse,
    Query,
} from "@google-cloud/datastore";

/**
 * Can help get data from Firestore
 */
export default class DatastoreHelper {
    readonly datastore: Datastore;

    /**
     * Helper constructor
     * @param {Datastore} datastore
     */
    constructor(datastore: Datastore) {
        this.datastore = datastore;
    }

    /**
     * Run query on Firestore
     * @param {Query} query
     */
    public async runQuery(query: Query): Promise<any> {
        try {
            return await this.datastore.runQuery(query);
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

    /**
     * Update existing entity in Firestore
     * @param {any} entity
     */
    public async updateEntity(entity: any): Promise<UpdateResponse> {
        try {
            return await this.datastore.update(entity);
        } catch (err: any) {
            throw new HttpsError("internal",
                err.details || "Unknown error occurred");
        }
    }
}

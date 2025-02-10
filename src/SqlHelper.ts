import * as sql from "mssql";
import {HttpsError} from "firebase-functions/v2/https";
import {defineSecret} from "firebase-functions/params";
import {MSSQL_ADDRESS, MSSQL_DATABASE, MSSQL_PASSWORD, MSSQL_USER} from "./constants";

export default class SqlHelper {
    readonly query: string;
    readonly config: any;

    constructor(query: string) {
        this.query = query;
        this.config = {
            user: defineSecret(MSSQL_USER),
            password: defineSecret(MSSQL_PASSWORD),
            server: defineSecret(MSSQL_ADDRESS), // You can use 'localhost\\instance' to connect to named instance
            database: defineSecret(MSSQL_DATABASE),
            options: {
                encrypt: false, // Use this if you're on Windows Azure
                enableArithAbort: true
            }
        };
    }

    public async sendQuery(): Promise<any> {
        try {
            await sql.connect(this.config);
            return await sql.query(this.query);
        } catch (err) {
            throw new HttpsError('internal', err.message);
        }
    }
}
import * as sql from "mssql";
import {HttpsError} from "firebase-functions/v2/https";
import {defineString} from "firebase-functions/params";
import {
    MSSQL_ADDRESS,
    MSSQL_DATABASE,
    MSSQL_PASSWORD,
    MSSQL_USER,
} from "./constants";
import {AuthData} from "firebase-functions/lib/common/providers/https";
import {ROLE} from "./role";

/**
 * Can help to retrieve data from MS SQL Server
 */
export default class SqlHelper {
    readonly query: string;
    readonly config: SqlConfig;
    readonly user = defineString(MSSQL_USER).value();
    readonly password = defineString(MSSQL_PASSWORD).value();
    readonly server = defineString(MSSQL_ADDRESS).value();
    readonly database = defineString(MSSQL_DATABASE).value();

    /**
     * Create a new instance
     * @param {string} query
     */
    constructor(query: string) {
        this.query = query;
        this.config = {
            user: this.user,
            password: this.password,
            // You can use 'localhost\\instance' to connect to named instance
            server: this.server,
            database: this.database,
            options: {
                encrypt: false, // Use this if you're on Windows Azure
                enableArithAbort: true,
            },
        };
    }

    /**
     * Returns vip depending on Role and Input
     * @param {BaseInput} data
     * @param {AuthData} auth
     *
     * @return {string} vip
     */
    public static getUserVip(data: BaseInput, auth?: AuthData): string {
        if (auth?.token?.["role"] as ROLE === ROLE.ADMIN ||
            auth?.token?.["role"] as ROLE === ROLE.MANAGER) {
            return data.vip || auth?.token?.["vip"];
        }
        return auth?.token?.["vip"];
    }

    /**
     * Send query to MS SQL Server
     */
    public async sendQuery(): Promise<QueryResult> {
        try {
            await sql.connect(this.config);
            return await sql.query(this.query);
        } catch (err: any) {
            throw new HttpsError("internal", err.message);
        }
    }
}

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
import {ConnectionPool, IResult, config} from "mssql";

/**
 * Can help to retrieve data from MS SQL Server
 */
export default class SqlHelper {
    readonly query: string;
    readonly config: config;
    readonly user = defineString(MSSQL_USER).value();
    readonly password = defineString(MSSQL_PASSWORD).value();
    readonly server = defineString(MSSQL_ADDRESS).value();
    readonly database = defineString(MSSQL_DATABASE).value();

    /**
     * Create a new instance
     * @param {string} query
     */
    constructor(query?: string) {
        this.query = query ? query : "";
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
     * Check whether user belongs to Client role
     * @param {AuthData} auth
     *
     * @return {boolean}
     */
    public static isClient(auth?: AuthData): boolean {
        return auth?.token?.["role"] === ROLE.CLIENT;
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
     * Returns clientId depending on Role and Input
     * @param {number} clientId
     * @param {AuthData} auth
     *
     * @return {number} client id
     */
    public static getClientId(clientId?: number, auth?: AuthData): number {
        if (auth?.token?.["role"] as ROLE === ROLE.ADMIN ||
            auth?.token?.["role"] as ROLE === ROLE.MANAGER) {
            return clientId || auth?.token?.["clientId"];
        }
        return auth?.token?.["clientId"];
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

    /**
     * Get Pool
     *
     * @return {ConnectionPool} connection pool
     */
    public async getPool(): Promise<ConnectionPool> {
        try {
            return await sql.connect(this.config);
        } catch (err: any) {
            throw new HttpsError("internal",
                err.message || "Unknown error occurred");
        }
    }

    /**
     * Create Pool Request
     * @param {ConnectionPool} connectionPool
     * @param {Array<SqlParameter>} params
     * @param {string} query
     * @param {boolean} executeAsStoredProcedure
     *
     * @return {SqlRequest} pool request with query
     */
    public createPoolRequest(connectionPool: ConnectionPool,
                             params: Array<SqlParameter>,
                             query: string,
                             executeAsStoredProcedure = false): SqlRequest {
        const request = connectionPool.request();
        for (const parameter of params) {
            request.input(parameter.name, parameter.type, parameter.value);
        }
        return {
            request,
            query,
            executeAsStoredProcedure,
        };
    }

    /**
     * Send Requests to MS SQL Server
     * @param {Array<SqlRequest>} sqlRequests
     *
     * @return {Promise<Array<IResult<any>>>} result
     */
    public async sendRequests(
        sqlRequests: Array<SqlRequest>): Promise<Array<IResult<any>>> {
        try {
            return await Promise.all(
                sqlRequests.map((it) => {
                    return it.executeAsStoredProcedure ?
                        it.request.execute(it.query) :
                        it.request.query(it.query);
                })
            );
        } catch (err: any) {
            throw new HttpsError("internal",
                err.message || "Unknown error occurred");
        }
    }

    public static DateTimeFormat = new Intl.DateTimeFormat("en", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
}

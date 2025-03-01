import * as sql from "mssql";
import {CallableRequest} from "firebase-functions/lib/common/providers/https";
import {
    GET_PARTS_BY_ANALOG,
    GET_PARTS_BY_BRAND_AND_NUMBER,
    SP_GET_PRODUCTS_BY_BRAND,
} from "./searchQueries";
import SqlHelper from "../SqlHelper";
import {Datastore} from "@google-cloud/datastore";
import DatastoreHelper from "../DatastoreHelper";

/* eslint-disable new-cap */
export const searchByBrandAndNumber = async (request: CallableRequest) => {
    const input: SearchByBrandAndNumberInput = request.data;
    const sqlHelper = new SqlHelper();
    const pool = await sqlHelper.getPool();
    const clientId = SqlHelper.getClientId(input.clientId, request.auth);
    const poolRequests = [];
    const getProductsByBrandRequest = sqlHelper.createPoolRequest(pool, [
        {
            name: "number",
            type: sql.VarChar(25),
            value: input.number,
        }, {
            name: "brand",
            type: sql.VarChar(18),
            value: input.brand,
        }, {
            name: "clientId",
            type: sql.Int,
            value: clientId,
        }, {
            name: "isVendorShown",
            type: sql.Bit,
            value: !SqlHelper.isClient(request.auth),
        }, {
            name: "isPartsFromAllVendorShown",
            type: sql.Bit,
            value: !SqlHelper.isClient(request.auth),
        },
    ], SP_GET_PRODUCTS_BY_BRAND, true);
    poolRequests.push(getProductsByBrandRequest);

    if (input.analogId) {
        const getPartsByAnalog = sqlHelper.createPoolRequest(pool, [
            {
                name: "analogId",
                type: sql.Int,
                value: input.analogId,
            },
        ], GET_PARTS_BY_ANALOG);
        poolRequests.push(getPartsByAnalog);
    } else {
        const getPartsByBrandAndNumberRequest =
            sqlHelper.createPoolRequest(pool, [
                {
                    name: "number",
                    type: sql.VarChar(25),
                    value: input.number,
                }, {
                    name: "brand",
                    type: sql.VarChar(18),
                    value: input.brand,
                },
            ], GET_PARTS_BY_BRAND_AND_NUMBER);
        poolRequests.push(getPartsByBrandAndNumberRequest);
    }

    const [search, inOrder] = await sqlHelper.sendRequests(poolRequests);
    if (SqlHelper.isClient(request.auth) && input.queryId) {
        const datastore = new Datastore();
        const datastoreHelper = new DatastoreHelper(datastore);
        const queryKey = datastore.key([
            "queries",
            Number.parseInt(input.queryId),
        ]);
        await datastoreHelper.updateEntity({
            key: queryKey,
            data: {
                date: new Date(),
                brand: input.brand,
                number: input.originalNumber,
                available: search.recordset
                    .some((part) => part["available"] > 0),
                success: true,
                vip: request.auth?.token?.["vip"],
            },
        });
    }
    return {
        search: search.recordset,
        inOrder: inOrder.recordset.map((part) => {
            const [{value: month}, , {value: day}, , {value: year}] =
                SqlHelper.DateTimeFormat.formatToParts(part.preliminaryDate);
            return {
                vip: part.vip,
                vendor: part.vendor,
                brand: part.brand,
                number: part.number,
                quantity: part.quantity,
                note: part.note,
                preliminaryDate:
                    part.preliminaryDate ? `${day}-${month}-${year}` : "",
                analogId: part.analogId,
            };
        }),
    };
};

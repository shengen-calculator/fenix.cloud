import * as format from "string-template";
import {CallableRequest} from "firebase-functions/lib/common/providers/https";
import {GET_ANALOG_BY_BRAND_AND_NUMBER} from "./searchQueries";
import SqlHelper from "../SqlHelper";

export const getAnalogs = async (request: CallableRequest) => {
    const input: GetAnalogsInput = request.data;
    let analogId = input.analogId;
    if (!analogId) {
        const sqlQuery = format(GET_ANALOG_BY_BRAND_AND_NUMBER, {
            brand: input.brand,
            number: input.number,
        });
        const sqlHelper = new SqlHelper(sqlQuery);
        const sqlResponse = await sqlHelper.sendQuery();
    }
}
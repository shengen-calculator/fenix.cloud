import * as format from "string-template";
import {CallableRequest} from "firebase-functions/lib/common/providers/https";
import SqlHelper from "../SqlHelper";
import {UPDATE_PRICE} from "./searchQueries";

export const updatePrice = async (request: CallableRequest) => {
    const input: UpdatePriceInput = request.data;
    const retail = input.price / (100 - input.discount) * 100;
    const sqlHelper = new SqlHelper(format(UPDATE_PRICE, {
        discount: input.price === 0 ? "null" : input.discount,
        price: input.price === 0 ? "null" : retail,
        price4: input.price === 0 ? "null" : input.price / 1.04,
        price14: input.price === 0 ? "null" : input.price / 1.02,
        price12: input.price === 0 ? "null" : input.price / 1.06,
        price5: input.price === 0 ?
            "null" : (1 - (1 - 0.75) * input.discount / 35) * retail,
        price6: input.price === 0 ?
            "null" : (1 - (1 - 0.7) * input.discount / 35) * retail,
        price1: input.price === 0 ?
            "null" : (1 - (1 - 0.95) * input.discount / 35) * retail,
        price2: input.price === 0 ?
            "null" : (1 - (1 - 0.9) * input.discount / 35) * retail,
        price3: input.price === 0 ?
            "null" : (1 - (1 - 0.85) * input.discount / 35) * retail,
        price10: input.price === 0 ?
            "null" : (1 - (1 - 0.55) * input.discount / 35) * retail,
        price7: input.price === 0 ? "null" : input.price,
        price13: input.price === 0 ? "null" : input.price,
        isPriceHandled: input.price === 0 ? 0 : 1,
        productId: input.productId,
    }));
    const sqlResponse = await sqlHelper.sendQuery();
    return {
        rowsAffected: sqlResponse.rowsAffected,
    };
};

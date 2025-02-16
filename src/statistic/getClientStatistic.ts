import * as format from "string-template";
import {Datastore} from "@google-cloud/datastore";
import {CallableRequest} from "firebase-functions/lib/common/providers/https";
import {HttpsError} from "firebase-functions/v2/https";
import {GET_CLIENT_STATISTICS} from "./statisticQueries";
import SqlHelper from "../SqlHelper";

export const getClientStatistic = async (request: CallableRequest) => {
    const data: GetClientStatisticInput = request.data;
    if (!data || !data.startDate || !data.endDate) {
        throw new HttpsError("invalid-argument",
            // eslint-disable-next-line max-len
            "The function must be called with two arguments 'start date' and 'end date'");
    }
    const dataStore = new Datastore();
    const storeQuery = dataStore
        .createQuery("queries", "")
        .filter("date", ">=", new Date(`${data.startDate} 00:00:00:000`))
        .filter("date", "<=", new Date(`${data.endDate} 23:59:59:999`))
        .limit(2000);

    const sqlQuery = format(GET_CLIENT_STATISTICS, {
        startDate: data.startDate,
        endDate: data.endDate,
    });
    const sqlHelper = new SqlHelper(sqlQuery);
    const [stat, totals] = await Promise.all([
        dataStore.runQuery(storeQuery),
        sqlHelper.sendQuery(),
    ]);
    const dateTimeFormat = new Intl.DateTimeFormat("en", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
    return {
        statistic: stat[0].map((x) => {
            const [{value: month},, {value: day},, {value: year}] =
                dateTimeFormat.formatToParts(x.date);
            return {
                vip: x.vip,
                brand: x.brand,
                number: x.number,
                query: x.query,
                available: x.available,
                success: x.success,
                date: `${day}-${month}-${year}`,
            };
        }),
        totals: totals.recordset,
    };
};

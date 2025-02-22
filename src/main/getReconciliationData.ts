import * as sql from "mssql";
import SqlHelper from "../SqlHelper";
import {
    CallableRequest
} from "firebase-functions/lib/common/providers/https";
import {
    GET_BALANCE,
    GET_RECONCILIATION_DATA
} from "./mainQueries";
import ReconciliationReport from "./ReconciliationReport";


export const getReconciliationData = async (request: CallableRequest) => {
    const data: GetReconciliationDataInput = request.data;
    const clientId = SqlHelper.getClientId(data.clientId, request.auth);
    const sqlHelper = new SqlHelper();
    const pool = await sqlHelper.getPool();
    const recordsRequest = sqlHelper.createPoolRequest(pool, [
        {
            name: "clientId",
            type: sql.Int,
            value: clientId,
        }, {
            name: "startDate",
            type: sql.Date,
            value: data.startDate,
        }, {
            name: "endDate",
            type: sql.Date,
            value: data.endDate,
        }
    ], GET_RECONCILIATION_DATA);

    const balanceRequest = sqlHelper.createPoolRequest(pool, [
        {
            name: "clientId",
            type: sql.Int,
            value: clientId,
        }, {
            name: "day",
            type: sql.Date,
            value: data.startDate,
        }
    ], GET_BALANCE);

    const [reconciliationData, balanceData] = sqlHelper.sendRequests([
        recordsRequest,
        balanceRequest
    ]);


    const fileName =
        `K0000${request.auth ? request.auth.token["vip"] : "test"}-${clientId}.xlsx`;

    const balanceInfo: BalanceInfo = balanceData.recordset.pop();
    const initialBalance = balanceInfo.result ? balanceInfo.result : 0;

    const report = new ReconciliationReport({
        data: reconciliationData.recordset,
        balance: initialBalance,
        fileName: fileName,
        startDate: data.startDate,
        endDate: data.endDate,
        isEuroClient: data.isEuroClient,
    });
    const workbook = report.generateWorkbook();
    return await report.getReportLink(workbook);
};

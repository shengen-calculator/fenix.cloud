import * as format from "string-template";
import {HttpsError} from "firebase-functions/v2/https";
import {
    AuthUserRecord,
} from "firebase-functions/lib/common/providers/identity";
import {GET_CLIENT_BY_EMAIL} from "./mainQueries";
import SqlHelper from "../SqlHelper";

export const beforeCreate = async (user?: AuthUserRecord) => {
    const email: string = user?.email?.length ? user.email : "";
    const sqlQuery = format(GET_CLIENT_BY_EMAIL, {
        email,
    });
    const sqlHelper = new SqlHelper(sqlQuery);
    const sqlResponse = await sqlHelper.sendQuery();
    const userInfo: UserInfo = sqlResponse.recordset.pop();

    if (email && userInfo && userInfo.isWebUser) {
        return;
    }
    throw new HttpsError("invalid-argument",
        `Unauthorized email "${email}"`);
};

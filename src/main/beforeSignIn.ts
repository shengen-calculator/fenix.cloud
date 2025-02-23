import * as format from "string-template";
import {defineString} from "firebase-functions/params";
import {AuthUserRecord} from "firebase-functions/lib/common/providers/identity";
import {ADMINISTRATORS, MANAGERS} from "../constants";
import {GET_CLIENT_BY_EMAIL} from "./mainQueries";
import SqlHelper from "../SqlHelper";
import {ROLE} from "../role";

export const beforeSignIn = async (user?: AuthUserRecord) => {
    const admins: string[] = defineString(ADMINISTRATORS).value().split(" ");
    const managers: string[] = defineString(MANAGERS).value().split(" ");
    const email: string = user?.email?.length ? user.email : "";
    const sqlQuery = format(GET_CLIENT_BY_EMAIL, {
        email,
    });
    const sqlHelper = new SqlHelper(sqlQuery);
    const sqlResponse = await sqlHelper.sendQuery();
    const userInfo: UserInfo = sqlResponse.recordset.pop();

    const customClaims: Claims = {
        role: admins.includes(email) ?
            ROLE.ADMIN :
            managers.includes(email) ?
                ROLE.MANAGER :
                ROLE.CLIENT,
        vip: userInfo.vip,
        clientId: userInfo.id,
    };
    return {
        sessionClaims: customClaims,
    };
};

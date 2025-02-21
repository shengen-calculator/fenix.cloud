import { GET_CLIENT_BY_EMAIL } from "./mainQueries";
import * as admin from 'firebase-admin';
import * as sql from 'mssql';
import { config } from '../mssql.connection';
import { RoleEnum } from '../RoleEnum';
import { Admins } from '../admins';
import { Managers } from '../managers';

// Define expected user object structure
interface User {
    uid: string;
    email?: string;
}

// Define expected client object structure from SQL query
interface Client {
    vip?: string;
    id?: number;
    isWebUser?: boolean;
}

// Define custom claims structure
interface CustomClaims {
    role?: string;
    vip?: string;
    clientId?: number;
}

// Function to process user sign-up
const processSignUp = async (user: User): Promise<void | { error: string }> => {
    let emailVerified = false;
    let customClaims: CustomClaims = {};

    try {
        await sql.connect(config);
        const result = await sql.query(GET_CLIENT_BY_EMAIL);
        const client: Client = result.recordset.length > 0 ? result.recordset[0] : {};

        if (user.email) {
            if (Admins.includes(user.email)) {
                emailVerified = true;
                customClaims = { role: RoleEnum.Admin, vip: client.vip, clientId: client.id };
            } else if (Managers.includes(user.email)) {
                emailVerified = true;
                customClaims = { role: RoleEnum.Manager, vip: client.vip, clientId: client.id };
            } else if (client?.isWebUser) {
                emailVerified = true;
                customClaims = { role: RoleEnum.Client, vip: client.vip, clientId: client.id };
            }
        }

        console.log(client);

        if (emailVerified && user.email) {
            // Set custom claims on the new user
            await admin.auth().setCustomUserClaims(user.uid, customClaims);

            // Notify client to force token refresh
            const metadataRef = admin.database().ref(`metadata/${user.uid}`);
            await metadataRef.set({ refreshTime: new Date().getTime() });
        } else {
            // Delete user if they don't meet criteria
            await admin.auth().deleteUser(user.uid);
            const metadataRef = admin.database().ref(`metadata/${user.uid}`);
            await metadataRef.set({ refreshTime: new Date().getTime() });
        }

    } catch (err: any) {
        console.error(err.message);
        return { error: err.message };
    }
};

export default processSignUp;

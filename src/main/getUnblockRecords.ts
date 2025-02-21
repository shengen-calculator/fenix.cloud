import * as functions from 'firebase-functions';
import * as util from '../util';
import { Datastore, Query } from '@google-cloud/datastore';

// Define expected structure of an entity in "unblock-records"
interface UnblockRecord {
    date: Date;
    email: string;
}

// Define the expected return type
interface UnblockRecordResponse {
    date: number;
    user: string;
}

// Function to fetch unblock records
const getUnblockRecords = async (data: string, context: functions.https.CallableContext): Promise<UnblockRecordResponse[]> => {
    util.checkForAdminRole(context);

    try {
        const datastore = new Datastore();
        const storeQuery: Query = datastore
            .createQuery('unblock-records')
            .filter('vip', '=', data)
            .order('date', { descending: true })
            .limit(10);

        const [entities] = await datastore.runQuery(storeQuery) as [UnblockRecord[]];

        return entities.map((entity) => ({
            date: entity.date?.getTime() ?? 0, // Ensure we don't get undefined
            user: entity.email
        }));

    } catch (err: any) {
        throw new functions.https.HttpsError('internal', err.message || 'Unknown error occurred');
    }
};

export default getUnblockRecords;

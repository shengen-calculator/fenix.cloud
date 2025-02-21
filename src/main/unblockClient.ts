import * as functions from 'firebase-functions';
import * as util from '../util';
import { Datastore, Query } from '@google-cloud/datastore';

// Define expected structure of an entity in "unblock-records"
interface UnblockRecord {
    vip: string;
    date: Date;
    email: string;
}

// Function to unblock a client
const unblockClient = async (data: string, context: functions.https.CallableContext): Promise<void | { err: string }> => {
    util.checkForAdminRole(context);

    const currentDate = new Date();
    const datastore = new Datastore();
    let recordDate: Date | undefined;

    try {
        const storeQuery: Query = datastore
            .createQuery('unblock-records')
            .filter('vip', '=', data)
            .order('date', { descending: true })
            .limit(1);

        const [entities] = await datastore.runQuery(storeQuery) as [UnblockRecord[]];

        if (entities.length > 0) {
            recordDate = entities.pop()?.date;
        }
    } catch (err: any) {
        throw new functions.https.HttpsError('internal', err.message || 'Unknown error occurred');
    }

    // Check if the user is already unblocked today
    if (recordDate &&
        recordDate.getFullYear() === currentDate.getFullYear() &&
        recordDate.getMonth() === currentDate.getMonth() &&
        recordDate.getDate() === currentDate.getDate()) {
        throw new functions.https.HttpsError('invalid-argument', 'Client is already unblocked');
    }

    console.log(context.auth);

    try {
        // Create unblock record
        const entityKey = datastore.key('unblock-records');
        await datastore.insert({
            key: entityKey,
            data: {
                vip: data,
                date: currentDate,
                email: context.auth?.token?.email || 'Unknown'
            }
        });
    } catch (err: any) {
        throw new functions.https.HttpsError('internal', err.message || 'Unknown error occurred');
    }
};

export default unblockClient;

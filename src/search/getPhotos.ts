import * as admin from "firebase-admin";
import {defineString} from "firebase-functions/params";
import {CallableRequest} from "firebase-functions/lib/common/providers/https";
import {BUCKET_NAME} from "../constants";
import {GetSignedUrlConfig} from "@google-cloud/storage/build/cjs/src/file";


export const getPhotos = async (request: CallableRequest) => {
    const data: GetPhotosInput = request.data;
    const bucketName = defineString(BUCKET_NAME).value();
    const bucket = admin.storage().bucket(bucketName);
    const options = {
        prefix: `${data.brand}/${data.number.toUpperCase()}/`,
        delimiter: "/",
    };

    const [files] = await bucket.getFiles(options);
    const expDate = new Date();
    expDate.setTime(expDate.getTime() + 2 * 24 * 60 * 60 * 1000);

    const config: GetSignedUrlConfig = {
        action: "read",
        // eslint-disable-next-line max-len
        expires: `${expDate.getMonth() + 1}-${expDate.getDate()}-${expDate.getFullYear()}`,
        host: "",
        signingEndpoint: "",
    };

    if (files.length) {
        const result = [];
        for (const file of files) {
            if (file.name !== `${data.brand}/${data.number}/`) {
                const resultFile = bucket.file(file.name);
                // eslint-disable-next-line no-await-in-loop
                const url = await resultFile.getSignedUrl(config);
                result.push(url);
            }
        }
        return {
            isPhotoFound: true,
            urls: result,
        };
    }
    return {
        isPhotoFound: false,
        urls: [`https://www.google.com/search?q=${data.brand}+${data.number}&client=safari&source=lnms&tbm=isch`],
    };
};

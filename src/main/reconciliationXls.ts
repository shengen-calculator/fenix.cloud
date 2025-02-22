import * as admin from "firebase-admin";
import * as excel from "exceljs";
import * as path from "path";
import * as fs from "fs";
import os from "os";
import {GetSignedUrlConfig} from "@google-cloud/storage/build/cjs/src/file";
import {UploadOptions} from "@google-cloud/storage/build/cjs/src/bucket";
import {defineString} from "firebase-functions/params";
import {BUCKET_ID, XLS_CONTENT_TYPE} from "../constants";

// Function to generate reconciliation XLS link
export const getReconciliationXlsLink = async (
    data: ReconciliationRow[],
    balance: number,
    fileName: string,
    startDate: string,
    endDate: string,
    isEuroClient: boolean = false
): Promise<string[]> => {
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('sheet1', {
        pageSetup: { paperSize: 15, orientation: 'landscape' }
    });

    worksheet.columns = [
        { key: 'invoice', width: 20 },
        { key: 'date', width: 15 },
        { key: 'brand', width: 18 },
        { key: 'number', width: 25 },
        { key: 'description', width: 67 },
        { key: 'price', width: 15 },
        { key: 'quantity', width: 15 },
        { key: 'total', width: 15 },
        { key: 'balance', width: 15 }
    ];

    worksheet.addRow([]);
    worksheet.mergeCells('A1:I1');
    worksheet.getCell('A1').value = `Акт звірки`;
    worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getCell('A1').font = { name: 'Arial', size: 32 };

    worksheet.addRow([]);
    worksheet.mergeCells('A2:C2');
    worksheet.getCell('A2').value = `Початок періоду звірки:`;
    worksheet.getCell('D2').value = new Date(startDate);
    worksheet.getCell('A2').font = { name: 'Arial', size: 14 };
    worksheet.getCell('D2').font = { name: 'Arial', size: 14 };

    worksheet.addRow([]);
    worksheet.mergeCells('A3:C3');
    worksheet.getCell('A3').value = `Кінець періоду звірки:`;
    worksheet.getCell('D3').value = new Date(endDate);
    worksheet.getCell('A3').font = { name: 'Arial', size: 14 };
    worksheet.getCell('D3').font = { name: 'Arial', size: 14 };

    worksheet.addRow([]);
    worksheet.mergeCells('A4:C4');
    worksheet.getCell('A4').value = `Баланс на початок періоду:`;
    worksheet.getCell('D4').value = balance;
    worksheet.getCell('A4').font = { name: 'Arial', size: 14 };
    worksheet.getCell('D4').font = { name: 'Arial', size: 14 };

    worksheet.addRow([]);
    worksheet.mergeCells('A5:I5');
    worksheet.addRow([]);
    worksheet.mergeCells('A6:I6');

    const tableHeader = [
        'Документ',
        'Дата',
        'Бренд',
        'Номер запчастини',
        'Опис',
        'Ціна',
        'Кількість',
        'Сумма',
        'Баланс'
    ];

    worksheet.addRow(tableHeader);
    let index = 8;
    let prevInvNumber = "";
    let invoiceTotal = 0;

    data.forEach((x) => {
        if (prevInvNumber !== x.invoiceNumber.toString() && prevInvNumber !== '' && prevInvNumber !== '0') {
            insertTotal(worksheet, balance, invoiceTotal, index);
            invoiceTotal = 0;
            index++;
        }

        const rowValues: (string | number | undefined)[] = [];

        if (x.invoiceNumber === 0) {
            rowValues[1] = `Оплата`;
            rowValues[2] = x.invoiceDate;
            rowValues[8] = -(isEuroClient ? x.priceEur ?? 0 : x.priceUah ?? 0);
            balance -= isEuroClient ? x.priceEur ?? 0 : x.priceUah ?? 0;
            rowValues[9] = Math.round(balance * 100) / 100;
        } else {
            rowValues[1] = x.quantity < 0
                ? `Повернення № ${x.invoiceNumber}`
                : prevInvNumber === x.invoiceNumber.toString()
                    ? ''
                    : `Накладна № ${x.invoiceNumber}`;
            rowValues[2] = x.invoiceDate;
            rowValues[3] = x.brand;
            rowValues[4] = x.number;
            rowValues[5] = x.description;
            rowValues[6] = isEuroClient ? x.priceEur ?? 0 : x.priceUah ?? 0;
            rowValues[7] = x.quantity;
            rowValues[8] = (isEuroClient ? x.priceEur ?? 0 : x.priceUah ?? 0) * x.quantity;
            invoiceTotal += (isEuroClient ? x.priceEur ?? 0 : x.priceUah ?? 0) * x.quantity;
            balance += (isEuroClient ? x.priceEur ?? 0 : x.priceUah ?? 0) * x.quantity;
        }

        worksheet.addRow(rowValues);

        if (x.invoiceNumber === 0) {
            worksheet.mergeCells(`C${index}:G${index}`);
            worksheet.getCell(`C${index}`).value = x.description;
        }

        index++;
        prevInvNumber = x.invoiceNumber.toString();
    });

    if (prevInvNumber !== '0') {
        insertTotal(worksheet, balance, invoiceTotal, index);
        index++;
    }

    paintRow(worksheet, 9, 7);

    const resultFilePath = `OutBox/${fileName}`;
    const tempLocalResultFile = path.join(os.tmpdir(), fileName);
    const contentType = defineString(XLS_CONTENT_TYPE).value();
    const metadata = {
        contentType,
        contentDisposition: `attachment; filename="${fileName}"`
    };

    await workbook.xlsx.writeFile(tempLocalResultFile);

    const uploadOptions = {
        destination: resultFilePath,
        metadata
    }

    await getBucket().upload(tempLocalResultFile, uploadOptions as UploadOptions);

    fs.unlinkSync(tempLocalResultFile);

    const expDate = new Date();
    expDate.setTime(expDate.getTime() + 2 * 24 * 60 * 60 * 1000);


    const config = {
        action: "read",
        expires: `${expDate.getMonth() + 1}-${expDate.getDate()}-${expDate.getFullYear()}`,
    };

    const resultFile = getBucket().file(resultFilePath);

    return await resultFile.getSignedUrl(config as GetSignedUrlConfig);
};

// Helper function to get Firebase storage bucket
const getBucket = () => admin.storage().bucket(defineString(BUCKET_ID).value());

// Function to color a row
const paintRow = (worksheet: excel.Worksheet, columnsNumber: number, row: number) => {
    const cells = 'ABCDEFGHIJKLMNOPRS'.split('').map(letter => `${letter}${row}`);
    cells.slice(0, columnsNumber).forEach(key => {
        worksheet.getCell(key).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'E6E6FA' }
        };
        worksheet.getCell(key).font = { name: 'Arial', size: 11, bold: true };
    });
};

// Function to insert invoice total row
const insertTotal = (worksheet: excel.Worksheet, balance: number, invoiceTotal: number, index: number) => {
    worksheet.addRow([, , , , , , , , Math.round(balance * 100) / 100]);
    worksheet.mergeCells(`F${index}:G${index}`);
    worksheet.getCell(`G${index}`).value = `Всього`;
    worksheet.getCell(`H${index}`).value = invoiceTotal;
};

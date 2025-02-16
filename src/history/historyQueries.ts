/* eslint-disable max-len */
export const GET_CLIENT_PAYMENTS = `
            SELECT ID_Касса                             as id,
                   Цена                                 as amountEur,
                   Грн                                  as amountUah,
                   FORMAT(dbo.Касса.Дата, 'dd.MM.yyyy') AS date,
                   dbo.Касса.Примечание                 as description,
                   COUNT(*) OVER ()                     as totalCount
            FROM dbo.Касса
                     INNER JOIN
                 dbo.Клиенты ON dbo.Касса.ID_Клиента = dbo.Клиенты.ID_Клиента
            WHERE dbo.Клиенты.VIP LIKE '{vip}'
            ORDER BY dbo.[Касса].ID_Касса DESC OFFSET {offset} ROWS FETCH NEXT {rows} ROWS ONLY`;
export const GET_CLIENT_RETURNS = `
            SELECT dbo.[Подчиненная накладные].ID                                          AS id,
                   dbo.[Подчиненная накладные].ID_Накладной                                AS invoiceNumber,
                   dbo.[Подчиненная накладные].Количество                                  AS quantity,
                   dbo.[Подчиненная накладные].Цена                                        AS priceEur,
                   dbo.[Подчиненная накладные].Грн                                         AS priceUah,
                   FORMAT(dbo.[Подчиненная накладные].Дата_закрытия, 'dd.MM.yyyy')         AS invoiceDate,
                   TRIM(dbo.Брэнды.Брэнд)                                                  AS brand,
                   TRIM(dbo.[Каталог запчастей].[Номер поставщика])                        AS number,
                   TRIM(dbo.[Каталог запчастей].Описание)                                  AS description,
                   COUNT(*) OVER ()                                                        AS totalCount
            FROM dbo.[Подчиненная накладные]
                     INNER JOIN
                 dbo.[Каталог запчастей] ON dbo.[Подчиненная накладные].ID_Запчасти = dbo.[Каталог запчастей].ID_Запчасти
                     INNER JOIN
                 dbo.Брэнды ON dbo.[Каталог запчастей].ID_Брэнда = dbo.Брэнды.ID_Брэнда
                     INNER JOIN
                 dbo.Клиенты ON dbo.[Подчиненная накладные].ID_Клиента = dbo.Клиенты.ID_Клиента
            WHERE (dbo.[Подчиненная накладные].ID_Накладной IS NOT NULL)
              AND (dbo.[Подчиненная накладные].Дата_закрытия IS NOT NULL)
              AND (dbo.Клиенты.VIP LIKE '{vip}')
              AND (dbo.[Подчиненная накладные].Нету = 0)
              AND (dbo.[Подчиненная накладные].Обработано = 1)
              AND (dbo.[Подчиненная накладные].Количество < 0)
            ORDER BY dbo.[Подчиненная накладные].ID DESC OFFSET {offset} ROWS FETCH NEXT {rows} ROWS ONLY`;
export const GET_CLIENT_SALES = `
            SELECT dbo.[Подчиненная накладные].ID                                          AS id,
                   dbo.[Подчиненная накладные].ID_Накладной                                AS invoiceNumber,
                   dbo.[Подчиненная накладные].Количество                                  AS quantity,
                   dbo.[Подчиненная накладные].Цена                                        AS priceEur,
                   dbo.[Подчиненная накладные].Грн                                         AS priceUah,
                   FORMAT(dbo.GetInvoiceDate(
                                  dbo.[Подчиненная накладные].ID_Накладной), 'dd.MM.yyyy') AS invoiceDate,
                   TRIM(dbo.Брэнды.Брэнд)                                                  AS brand,
                   TRIM(dbo.[Каталог запчастей].[Номер поставщика])                        AS number,
                   TRIM(dbo.[Каталог запчастей].Описание)                                  AS description,
                   COUNT(*) OVER ()                                                        as totalCount
            FROM dbo.[Подчиненная накладные]
                     INNER JOIN
                 dbo.[Каталог запчастей] ON dbo.[Подчиненная накладные].ID_Запчасти = dbo.[Каталог запчастей].ID_Запчасти
                     INNER JOIN
                 dbo.Брэнды ON dbo.[Каталог запчастей].ID_Брэнда = dbo.Брэнды.ID_Брэнда
                     INNER JOIN
                 dbo.Клиенты ON dbo.[Подчиненная накладные].ID_Клиента = dbo.Клиенты.ID_Клиента
            WHERE (dbo.[Подчиненная накладные].ID_Накладной IS NOT NULL)
              AND (dbo.[Подчиненная накладные].Дата_закрытия IS NOT NULL)
              AND (dbo.Клиенты.VIP LIKE '{vip}')
              AND (dbo.[Подчиненная накладные].Нету = 0)
              AND (dbo.[Подчиненная накладные].Обработано = 1)
              AND (dbo.[Подчиненная накладные].Количество > 0)
            ORDER BY dbo.[Подчиненная накладные].ID DESC OFFSET {offset} ROWS FETCH NEXT {rows} ROWS ONLY`;

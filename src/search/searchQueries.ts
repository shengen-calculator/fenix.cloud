/* eslint-disable max-len */
export const GET_ANALOG_BY_BRAND_AND_NUMBER = `
        SELECT TOP (1) dbo.[Каталог запчастей].ID_аналога AS analogId
        FROM dbo.[Каталог запчастей]
                 INNER JOIN
             dbo.Брэнды ON dbo.[Каталог запчастей].ID_Брэнда = dbo.Брэнды.ID_Брэнда
        WHERE (dbo.[Каталог запчастей].NAME = '{number}')
          AND (dbo.Брэнды.Брэнд = '{brand}')
        ORDER BY dbo.[Каталог запчастей].ID_аналога DESC`;
export const GET_ANALOGS_BY_ID = `
        SELECT TOP (1000) dbo.[Каталог запчастей].ID_Запчасти              AS productId,
                 RTRIM(dbo.Поставщики.[Сокращенное название])              AS vendor,
                 RTRIM(dbo.Брэнды.Брэнд)                                   AS brand,
                 RTRIM(dbo.[Каталог запчастей].[Номер запчасти])           AS number,
                 dbo.[Каталог запчастей].Цена7                             AS price,
                 dbo.[Каталог запчастей].Цена                              AS retail,
                 dbo.[Каталог запчастей].Скидка                            AS discount,
                 ISNULL(dbo.Остаток_.Остаток, 0)                           AS stock,
                 dbo.GetVendorPrice(dbo.[Каталог запчастей].ID_Запчасти)   AS vendorPrice,
                 dbo.GetPurchasePrice(dbo.[Каталог запчастей].ID_Запчасти) AS purchasePrice
        FROM dbo.[Каталог запчастей]
                 INNER JOIN
             dbo.Брэнды ON dbo.[Каталог запчастей].ID_Брэнда = dbo.Брэнды.ID_Брэнда
                 INNER JOIN
             dbo.Поставщики ON dbo.[Каталог запчастей].ID_Поставщика = dbo.Поставщики.ID_Поставщика
                 LEFT OUTER JOIN
             dbo.Остаток_ ON dbo.[Каталог запчастей].ID_Запчасти = dbo.Остаток_.ID_Запчасти
        WHERE (dbo.[Каталог запчастей].ID_аналога = {analogId})`;
export const GET_PARTS_BY_NUMBER = `
       SELECT brand
            ,number
            ,shortNumber
            ,description
            ,productId
            ,analogId
            ,firstBrend
       FROM getPartsByNumber('{number}')`;

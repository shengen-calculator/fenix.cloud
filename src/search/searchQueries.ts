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
export const SP_GET_PRODUCTS_BY_BRAND = "sp_web_getproductsbybrand";
export const GET_PARTS_BY_ANALOG = `
       SELECT  RTRIM(dbo.Клиенты.VIP)                        AS vip,
               RTRIM(dbo.Поставщики.[Сокращенное название])  AS vendor,
               RTRIM(Брэнды_1.Брэнд)                         AS brand,
               RTRIM([Каталог запчастей_1].[Номер запчасти]) AS number,
               dbo.[Запросы клиентов].Заказано               AS quantity,
               RTRIM(dbo.[Запросы клиентов].Примечание)      AS note,
               dbo.[Запросы клиентов].Дата_заказа            AS date,
               dbo.[Запросы клиентов].Срочно                 AS isUrgent,
               dbo.[Заказы поставщикам].Предварительная_дата AS preliminaryDate,
               AnalogTable.analogId                          AS analogId
       FROM (SELECT MAX(dbo.[Каталог запчастей].ID_аналога)  AS analogId
              FROM dbo.[Каталоги поставщиков]
                       INNER JOIN
                   dbo.Брэнды ON dbo.[Каталоги поставщиков].Брэнд = dbo.Брэнды.Брэнд
                       INNER JOIN
                   dbo.[Каталог запчастей] ON dbo.Брэнды.ID_Брэнда = dbo.[Каталог запчастей].ID_Брэнда AND
                                              dbo.[Каталоги поставщиков].Name = dbo.[Каталог запчастей].namepost
              WHERE (dbo.[Каталог запчастей].ID_аналога = @analogId)) AS AnalogTable
                 INNER JOIN
             dbo.[Каталог запчастей] AS [Каталог запчастей_1] ON AnalogTable.analogId = [Каталог запчастей_1].ID_аналога
                 INNER JOIN
             dbo.[Запросы клиентов] ON [Каталог запчастей_1].ID_Запчасти = dbo.[Запросы клиентов].ID_Запчасти
                 INNER JOIN
             dbo.Клиенты ON dbo.[Запросы клиентов].ID_Клиента = dbo.Клиенты.ID_Клиента
                 INNER JOIN
             dbo.Брэнды AS Брэнды_1 ON [Каталог запчастей_1].ID_Брэнда = Брэнды_1.ID_Брэнда
                 INNER JOIN
             dbo.Поставщики ON [Каталог запчастей_1].ID_Поставщика = dbo.Поставщики.ID_Поставщика
                 LEFT OUTER JOIN
             dbo.[Заказы поставщикам] ON dbo.[Запросы клиентов].ID_Заказа = dbo.[Заказы поставщикам].ID_Заказа
       WHERE (dbo.[Запросы клиентов].Заказано <> 0)
                AND (dbo.[Запросы клиентов].Доставлено = 0)
                AND (dbo.[Запросы клиентов].Обработано = 0)`;
export const GET_PARTS_BY_BRAND_AND_NUMBER = `
        SELECT RTRIM(dbo.Клиенты.VIP)                        AS vip,
               RTRIM(dbo.Поставщики.[Сокращенное название])  AS vendor,
               RTRIM(Брэнды_1.Брэнд)                         AS brand,
               RTRIM([Каталог запчастей_1].[Номер запчасти]) AS number,
               dbo.[Запросы клиентов].Заказано               AS quantity,
               RTRIM(dbo.[Запросы клиентов].Примечание)      AS note,
               dbo.[Запросы клиентов].Дата_заказа            AS date,
               dbo.[Запросы клиентов].Срочно                 AS isUrgent,
               dbo.[Заказы поставщикам].Предварительная_дата AS preliminaryDate,
               AnalogTable.analogId                          AS analogId
        FROM (SELECT MAX(dbo.[Каталог запчастей].ID_аналога) AS analogId
              FROM dbo.[Каталоги поставщиков]
                       INNER JOIN
                   dbo.Брэнды ON dbo.[Каталоги поставщиков].Брэнд = dbo.Брэнды.Брэнд
                       INNER JOIN
                   dbo.[Каталог запчастей] ON dbo.Брэнды.ID_Брэнда = dbo.[Каталог запчастей].ID_Брэнда AND
                                              dbo.[Каталоги поставщиков].Name = dbo.[Каталог запчастей].namepost
              WHERE (dbo.Брэнды.Брэнд = '@brand')
                AND (dbo.[Каталоги поставщиков].Name = '@number')) AS AnalogTable
                 INNER JOIN
             dbo.[Каталог запчастей] AS [Каталог запчастей_1] ON AnalogTable.analogId = [Каталог запчастей_1].ID_аналога
                 INNER JOIN
             dbo.[Запросы клиентов] ON [Каталог запчастей_1].ID_Запчасти = dbo.[Запросы клиентов].ID_Запчасти
                 INNER JOIN
             dbo.Клиенты ON dbo.[Запросы клиентов].ID_Клиента = dbo.Клиенты.ID_Клиента
                 INNER JOIN
             dbo.Брэнды AS Брэнды_1 ON [Каталог запчастей_1].ID_Брэнда = Брэнды_1.ID_Брэнда
                 INNER JOIN
             dbo.Поставщики ON [Каталог запчастей_1].ID_Поставщика = dbo.Поставщики.ID_Поставщика
                 LEFT OUTER JOIN
             dbo.[Заказы поставщикам] ON dbo.[Запросы клиентов].ID_Заказа = dbo.[Заказы поставщикам].ID_Заказа
        WHERE (dbo.[Запросы клиентов].Заказано <> 0)
          AND (dbo.[Запросы клиентов].Доставлено = 0)
          AND (dbo.[Запросы клиентов].Обработано = 0)`;

export const GET_DELIVERY_DATE = `
        SET DATEFIRST 1
        SELECT FORMAT(dbo.GetArrivalDate((
            SELECT WarehouseId FROM [Каталоги поставщиков] WHERE ID_Запчасти = {productId}
        ), {term}), 'dd.MM.yyyy') as ArrivalDate, ArrivalTime
        FROM SupplierWarehouse
        WHERE Id = (
            SELECT WarehouseId FROM [Каталоги поставщиков] WHERE ID_Запчасти = {productId}
        )`;
export const UPDATE_PRICE = `
        UPDATE dbo.[Каталог запчастей]
        SET Скидка          = {discount},
            Цена            = {price},
            Цена4           = {price4},
            Цена14          = {price14},
            Цена12          = {price12},
            Цена5           = {price5},
            Цена6           = {price6},
            Цена1           = {price1},
            Цена2           = {price2},
            Цена3           = {price3},
            Цена10          = {price10},
            Цена7           = {price7},
            Цена13          = {price13},
            Цена_обработана = {isPriceHandled}
        WHERE ID_Запчасти = {productId}`;

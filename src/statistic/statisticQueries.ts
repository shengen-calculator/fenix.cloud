/* eslint-disable max-len */
export const GET_VENDOR_STATISTIC = `
        SELECT TOP (100) 
               dbo.[Каталог запчастей].ID_Поставщика           AS vendorId
               ,TRIM(dbo.Поставщики.[Сокращенное название])    AS vendor
               ,COUNT(dbo.[Запросы клиентов].ID_Запроса)       AS quantity
        FROM   dbo.[Каталог запчастей] INNER JOIN
                    dbo.[Запросы клиентов] ON dbo.[Каталог запчастей].ID_Запчасти = dbo.[Запросы клиентов].ID_Запчасти INNER JOIN
                        dbo.Поставщики ON dbo.[Каталог запчастей].ID_Поставщика = dbo.Поставщики.ID_Поставщика
        WHERE  (dbo.[Запросы клиентов].Подтверждение = 0) AND 
                    (dbo.[Запросы клиентов].Интернет = 1) AND 
                    (dbo.[Запросы клиентов].Обработано = 0) AND 
                    (dbo.[Запросы клиентов].Заказано > 0) AND 
                    (dbo.[Запросы клиентов].ID_Клиента <> 378)
        GROUP BY dbo.[Каталог запчастей].ID_Поставщика, dbo.Поставщики.[Сокращенное название]`;
export const GET_STATISTICS_BY_VENDOR = `
        SELECT TOP(200) [Запросы клиентов].ID_Запроса           AS id
            ,TRIM([Запросы клиентов].Работник)                  AS vip
            ,TRIM(Брэнды.Брэнд)                                 AS brand
            ,TRIM([Каталог запчастей].[Номер запчасти])         AS number
            ,[Запросы клиентов].Заказано                        AS quantity
            ,[Запросы клиентов].Цена                            AS price
            ,FORMAT([Запросы клиентов].Дата, 'd', 'de-de')      AS date
            ,ISNULL(Остаток_по_аналогу.Остаток,0)               AS available
        FROM [Каталог запчастей] INNER JOIN
                    [Запросы клиентов] ON [Каталог запчастей].ID_Запчасти = [Запросы клиентов].ID_Запчасти INNER JOIN
                    Брэнды ON [Каталог запчастей].ID_Брэнда = Брэнды.ID_Брэнда LEFT OUTER JOIN
                    Остаток_по_аналогу ON [Каталог запчастей].ID_аналога = Остаток_по_аналогу.ID_аналога
        WHERE ([Запросы клиентов].Подтверждение = 0) AND ([Запросы клиентов].Интернет = 1) AND ([Запросы клиентов].Обработано = 0) AND 
                    ([Запросы клиентов].Заказано > 0) AND ([Запросы клиентов].ID_Клиента <> 378) AND ([Каталог запчастей].ID_Поставщика = {vendorId}) 
        ORDER BY [Запросы клиентов].Дата DESC`;
export const GET_CLIENT_STATISTICS = `
        SELECT ISNULL(RES.ID_Клиента, ORD.ID_Клиента) AS ClientId,
               RTRIM(ISNULL(RES.VIP, ORD.VIP))        AS VIP,
               RTRIM(ISNULL(RES.EMail, ORD.EMail))    AS Email,
               ISNULL(RES.Reserves, 0)                AS Reserves,
               ISNULL(ORD.Orders, 0)                  AS Orders
        FROM (SELECT dbo.Клиенты.ID_Клиента,
                     dbo.Клиенты.VIP,
                     dbo.Клиенты.EMail,
                     COUNT(dbo.[Подчиненная накладные].ID) AS Reserves
              FROM  dbo.Клиенты
                       LEFT OUTER JOIN
                    dbo.[Подчиненная накладные] ON dbo.Клиенты.ID_Клиента = dbo.[Подчиненная накладные].ID_Клиента
              WHERE (CONVERT(date, dbo.[Подчиненная накладные].Дата) >= '{startDate}')
                    AND (CONVERT(date, dbo.[Подчиненная накладные].Дата) <= '{endDate}')
                    AND dbo.[Подчиненная накладные].Заказ IS NULL
              GROUP BY dbo.Клиенты.ID_Клиента, dbo.Клиенты.VIP, dbo.Клиенты.EMail
              HAVING (dbo.Клиенты.ID_Клиента <> 378)) AS RES
                    FULL OUTER JOIN (SELECT dbo.Клиенты.ID_Клиента,
                                         dbo.Клиенты.VIP,
                                         dbo.Клиенты.EMail,
                                         COUNT(dbo.[Запросы клиентов].ID_Запроса) AS Orders
                                  FROM  dbo.Клиенты
                                           INNER JOIN
                                        dbo.[Запросы клиентов] ON dbo.Клиенты.ID_Клиента = dbo.[Запросы клиентов].ID_Клиента
                                  WHERE (dbo.[Запросы клиентов].Заказано > 0)
                                        AND (dbo.[Запросы клиентов].Интернет = 1)
                                        AND (CONVERT(date, dbo.[Запросы клиентов].Дата) <= '{endDate}')
                                        AND (CONVERT(date, dbo.[Запросы клиентов].Дата) >= '{startDate}')
                                  GROUP BY dbo.Клиенты.ID_Клиента, dbo.Клиенты.VIP, dbo.Клиенты.EMail
                                  HAVING (dbo.Клиенты.ID_Клиента <> 378)) AS ORD ON RES.ID_Клиента = ORD.ID_Клиента`;

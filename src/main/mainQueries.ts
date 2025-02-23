/* eslint-disable max-len */
export const GET_CLIENT = `
        SELECT TOP (3)
            ID_Клиента                                  as id
            ,TRIM([VIP])                                as vip
            ,TRIM([Фамилия]) + ' ' + TRIM([Имя])        as fullName     
            ,[Расчет_в_евро]                            as isEuroClient      
            ,[Интернет_заказы]                          as isWebUser
            ,IsCityDeliveryUsed                         as isCityDeliveryUsed
            ,[Выводить_просрочку]                       as isShowDebtRecords
        FROM [FenixParts].[dbo].[Клиенты]
        WHERE VIP like '{vip}'`;
export const GET_CURRENCY_RATE = `
        SELECT TOP (1) Дата, Доллар AS USD, Евро AS EUR 
        FROM dbo.[Внутренний курс валют] 
        ORDER BY Дата DESC`;
export const GET_CLIENT_INFO = `
        SELECT TOP (1) ID_Клиента as id
                ,ISNULL([Количество_дней], 0) as days
        FROM [dbo].[Клиенты]
        WHERE VIP like '{vip}'`;
export const GET_CLIENT_PAYMENTS = `
        WITH gen AS (
            SELECT DATEADD(day, 0, CURRENT_TIMESTAMP)               AS PaymentDate,
                    dbo.GetAmountOverdueDebt({id}, -{days}) - 0     AS Amount,
                    0                                               AS num
            UNION ALL
            SELECT DATEADD(day, num + 1, CURRENT_TIMESTAMP)                 as PaymentDate,
                    (dbo.GetAmountOverdueDebt({id}, -{days} + num + 1) -
                    dbo.GetAmountOverdueDebt({id}, -{days} + num))          as Amount,
                    num + 1
            FROM gen
            WHERE num + 1 <= {days}
        )
        SELECT FORMAT(PaymentDate, 'd', 'de-de') as date, Amount as amount
        FROM gen`;
export const GET_RECONCILIATION_DATA = `
        SELECT dbo.[Подчиненная накладные].ID                   AS id,
           dbo.[Подчиненная накладные].ID_Накладной             AS invoiceNumber,
           dbo.[Подчиненная накладные].Количество               AS quantity,
           dbo.[Подчиненная накладные].Цена                     AS priceEur,
           dbo.[Подчиненная накладные].Грн                      AS priceUah,
           IIF(dbo.[Подчиненная накладные].Количество > 0,
               dbo.GetInvoiceDate(dbo.[Подчиненная накладные].ID_Накладной),
               dbo.[Подчиненная накладные].Дата_закрытия)       AS invoiceDate,
           dbo.Брэнды.Брэнд                                     AS brand,
           dbo.[Каталог запчастей].[Номер поставщика]           AS number,
           dbo.[Каталог запчастей].Описание                     AS description
        FROM dbo.[Подчиненная накладные]
                 INNER JOIN
             dbo.[Каталог запчастей] ON dbo.[Подчиненная накладные].ID_Запчасти = dbo.[Каталог запчастей].ID_Запчасти
                 INNER JOIN
             dbo.Брэнды ON dbo.[Каталог запчастей].ID_Брэнда = dbo.Брэнды.ID_Брэнда
        WHERE (dbo.[Подчиненная накладные].ID_Накладной IS NOT NULL)
          AND (dbo.[Подчиненная накладные].Дата_закрытия IS NOT NULL)
          AND (dbo.[Подчиненная накладные].ID_Клиента = @clientId)
          AND (dbo.[Подчиненная накладные].Нету = 0)
          AND (dbo.[Подчиненная накладные].Обработано = 1)
          AND (IIF(dbo.[Подчиненная накладные].Количество > 0,
                   dbo.GetInvoiceDate(dbo.[Подчиненная накладные].ID_Накладной),
                   dbo.[Подчиненная накладные].Дата_закрытия) >= @startDate)
          AND (IIF(dbo.[Подчиненная накладные].Количество > 0,
                   dbo.GetInvoiceDate(dbo.[Подчиненная накладные].ID_Накладной),
                   dbo.[Подчиненная накладные].Дата_закрытия) < DATEADD(day, 1, @endDate))
        UNION
    
        SELECT ID_Касса            as id,
               0                   as invoiceNumber,
               0                   as quantity,
               Цена                as priceEur,
               Грн                 as priceUah,
               CONVERT(date, Дата) AS invoiceDate,
               ''                  as brand,
               ''                  as number,
               Примечание          as description
        FROM dbo.Касса
        WHERE (ID_Клиента = @clientId)
          AND (CONVERT(date, Дата) >= @startDate)
          AND (CONVERT(date, Дата) < DATEADD(day, 1, @endDate))
        ORDER BY InvoiceDate, invoiceNumber`;
export const GET_BALANCE = "SELECT dbo.GetBalanceOnDate(@clientId, @day) as result";
export const GET_CLIENT_BY_EMAIL = `
      SELECT TOP (3)
           ID_Клиента                               as id
          ,TRIM([VIP])                              as vip
          ,TRIM([Фамилия]) + ' ' + TRIM([Имя])      as fullName     
          ,[Расчет_в_евро]                          as isEuroClient      
          ,[Интернет_заказы]                        as isWebUser
      FROM [FenixParts].[dbo].[Клиенты]
      WHERE EMail like '{email}'`;

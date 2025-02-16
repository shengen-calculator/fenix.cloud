/* eslint-disable max-len */
export const GET_CLIENT = `
        SELECT TOP (3)
            ID_Клиента as                               id
            ,TRIM([VIP]) as                             vip
            ,TRIM([Фамилия]) + ' ' + TRIM([Имя]) as     fullName     
            ,[Расчет_в_евро] as                         isEuroClient      
            ,[Интернет_заказы] as                       isWebUser
            ,IsCityDeliveryUsed as                      isCityDeliveryUsed
            ,[Выводить_просрочку] as                    isShowDebtRecords
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
            SELECT DATEADD(day, 0, CURRENT_TIMESTAMP) AS            PaymentDate,
                    dbo.GetAmountOverdueDebt({id}, -{days}) - 0 AS  Amount,
                    0 AS                                            num
            UNION ALL
            SELECT DATEADD(day, num + 1, CURRENT_TIMESTAMP) as          PaymentDate,
                    (dbo.GetAmountOverdueDebt({id}, -{days} + num + 1) -
                    dbo.GetAmountOverdueDebt({id}, -{days} + num)) as   Amount,
                    num + 1
            FROM gen
            WHERE num + 1 <= {days}
        )
        SELECT FORMAT(PaymentDate, 'd', 'de-de') as date, Amount as amount
        FROM gen`;

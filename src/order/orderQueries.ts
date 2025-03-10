/* eslint-disable max-len */
export const GET_RESERVES = `
       SELECT TOP (100) [ID] as id
          ,TRIM([Поставщик]) as vendor
          ,TRIM([Статус]) as note
          ,[ID_Накладной] as invoiceId
          ,TRIM([VIP]) as vip
          ,TRIM([Брэнд]) as brand
          ,[Количество] as quantity
          ,[Цена] as euro
          ,[Грн] as uah
          ,[ID_Клиента] as clientId
          ,[ID_Запчасти] as productId
          ,TRIM([Описание]) as description
          ,FORMAT([Дата резерва], 'dd.MM.yy HH:mm') as 'date'
          ,FORMAT([Дата запроса], 'dd.MM.yy') as orderDate
          ,[Интернет] as source
          ,TRIM([Номер поставщика]) as number
      FROM [dbo].[Накладные]
      WHERE VIP like '{vip}' AND [Обработано] = 0 AND [ID_Клиента] <> 378`;
export const GET_ORDERS = `
      SELECT DISTINCT TOP (100) TRIM(VIP) as vip
          ,TRIM([Сокращенное название]) AS vendor
          ,Альтернатива as note
          ,ID_Запроса as id
          ,TRIM(Брэнд) as brand
          ,TRIM([Номер поставщика]) as number
          ,Заказано as ordered
          ,Подтверждение as approved
          ,FORMAT(ISNULL(Предварительная_дата, Дата_прихода), 'dd.MM.yyyy') as shipmentDate
          ,Цена as euro
          ,Грн as uah
          ,ID_Запчасти as productId
          ,ID_Заказа as orderId
          ,FORMAT (Дата, 'dd.MM.yyyy HH:mm') as orderDate
          ,TRIM(Описание) as description
          ,CASE
            WHEN Задерживается = 1 THEN 3  /* задерживается */
            WHEN Нет = 1 THEN 4  /* нету */
            WHEN Заказано = Подтверждение AND Подтверждение > 0 THEN 0 /* подтвержден */
            WHEN Подтверждение = 0 AND Нет = 0 THEN 1  /* в обработке */
            WHEN Заказано > Подтверждение AND Подтверждение > 0 THEN 2  /* неполное кол-во */
                ELSE 1
            END as status
      FROM dbo.Запросы
      WHERE VIP like '{vip}' AND [Обработано] = 0 AND [ID_Клиента] <> 378 AND ([Нет] = 0 OR DATEDIFF(hour, [Дата], SYSDATETIME()) < 168)`;
export const DELETE_RESERVES = `
      DELETE FROM dbo.[Подчиненная накладные] 
      WHERE ID IN (
          SELECT Name FROM dbo.SplitString('{ids}')
      )`;
export const DELETE_ORDERS = `
      UPDATE dbo.[Запросы клиентов] SET Заказано = 0, Обработано = 1 
      WHERE ID_Запроса IN (
          SELECT Name FROM dbo.SplitString ('{ids}')
      )`;

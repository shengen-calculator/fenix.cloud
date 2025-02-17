type QueryResult = {
    recordset: Array<any>
}

type SqlConfig = {
    user: string,
    password: string,
    server: string,
    database: string,
    options: SqlConfigOptions
}

type SqlConfigOptions = {
    encrypt: boolean
    enableArithAbort: boolean
}

type DebtInfo = {
    id: number,
    days: number
}

type BaseInput = {
    vip?: string
    offset?: number
    rows?: number
}

type GetClientStatisticInput = {
    startDate: string
    endDate: string
}

type GetPaymentsInput = BaseInput

type GetSalesInput = BaseInput

type GetReturnsInput = BaseInput

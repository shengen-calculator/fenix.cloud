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

type BaseInput = {
    vip?: string
    offset?: number
    rows?: number
}

type GetClientStatisticInput = {
    startDate: string
    endDate: string
}

type GetAnalogsInput = {
    analogId?: number
    brand: string
    number: string
}

type AnalogInfo = {
    analogId: number
}

type GetPaymentsInput = BaseInput

type GetSalesInput = BaseInput

type GetReturnsInput = BaseInput

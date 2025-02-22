type QueryResult = {
    recordset: Array<any>
}

type SqlParameter = {
    name: string
    type: import("mssql").ISqlTypeFactoryWithNoParams
    value: string | number
}

type SqlRequest = {
    request: import("mssql").Request
    query: string
}

type DebtInfo = {
    id: number
    days: number
}

type BalanceInfo = {
    result: number
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

type GetReconciliationDataInput = {
    startDate: string
    endDate: string
    isEuroClient: boolean
    clientId?: number
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

interface ReconciliationRow {
    invoiceNumber: number;
    invoiceDate: string;
    brand?: string;
    number?: string;
    description: string;
    priceUah?: number;
    priceEur?: number;
    quantity: number;
}

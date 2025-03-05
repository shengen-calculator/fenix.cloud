type QueryResult = {
    recordset: Array<any>
    rowsAffected: Array<any>
}

type SqlParameter = {
    name: string
    type: import("mssql").ISqlTypeFactoryWithNoParams |
        import("mssql").ISqlTypeWithLength
    value: string | number | boolean
}

type SqlRequest = {
    request: import("mssql").Request
    query: string
    executeAsStoredProcedure: boolean
}

type DebtInfo = {
    id: number
    days: number
}

type UnblockRecord = {
    date: Date;
    email: string;
}

type UserInfo = {
    id: number
    vip: string
    fullName: string
    isEuroClient: boolean
    isWebUser: boolean
}

type Claims = {
    role: number
    vip: string
    clientId: number
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

type GetPhotosInput = {
    number: string
    brand: string
}

type SearchByBrandAndNumberInput = {
    queryId?: string
    analogId?: number
    clientId?: number
    originalNumber: string
    number: string
    brand: string
}

type GetDeliveryDateInput = {
    productId: number
    term: number
}

type UpdatePriceInput = {
    productId: number
    price: number
    discount: number
}

type GetAnalogsInput = {
    analogId?: number
    brand: string
    number: string
}

type AnalogInfo = {
    analogId: number
}

type ClientDebt = {
    overdueDebt: number
    vip: string
}

type GetPaymentsInput = BaseInput

type GetSalesInput = BaseInput

type GetReturnsInput = BaseInput

type ReconciliationParams = {
    data: ReconciliationRow[],
    balance: number
    fileName: string
    startDate: string
    endDate: string
    isEuroClient: boolean
}

type ReconciliationRow = {
    invoiceNumber: number;
    invoiceDate: string;
    brand?: string;
    number?: string;
    description: string;
    priceUah?: number;
    priceEur?: number;
    quantity: number;
}

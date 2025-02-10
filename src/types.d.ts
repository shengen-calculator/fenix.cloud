type ROLE = "ADMIN" | "MANAGER" | "CLIENT";

type QueryResult = {
    recordset: Array<any>
}

type SqlError = {
    message: string
}

type BaseInput = {
    vip?: string
    offset?: number
    rows?: number
}

type GetPaymentsInput = BaseInput

export interface FinancialData {
    expenses: number;
    income: number;
}

export const getFinancialData = (): Promise<FinancialData> => {
    return new Promise((resolve) => {
        // Simulate API delay
        setTimeout(() => {
            resolve({
                expenses: 5000,
                income: 20000
            })
        }, 500)
    })
}

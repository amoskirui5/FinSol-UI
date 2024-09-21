// enums.ts

export enum LoanStatus {
    Pending = 0,
    Approved = 1,
    Declined = 2,
    Disbursed = 3,
}

export enum InterestRateType {
    PerAnnum = 0,
    PerMonth = 1,
    PerWeek = 2,
    PerDay = 3,
}

export enum InterestRateMethod {
    SimpleInterest = 0,
    ReducingBalance = 1,
    Amortized = 2,
    Compound = 3,
}

export const LoanStatusOptions = [
    { label: 'Pending', value: LoanStatus.Pending },
    { label: 'Approved', value: LoanStatus.Approved },
    { label: 'Declined', value: LoanStatus.Declined },
    { label: 'Disbursed', value: LoanStatus.Disbursed },
];

export const InterestRateTypeOptions = [
    { label: 'Per Annum', value: InterestRateType.PerAnnum },
    { label: 'Per Month', value: InterestRateType.PerMonth },
    { label: 'Per Week', value: InterestRateType.PerWeek },
    { label: 'Per Day', value: InterestRateType.PerDay },
];

export const InterestRateMethodOptions = [
    { label: 'Simple Interest', value: InterestRateMethod.SimpleInterest },
    { label: 'Reducing Balance', value: InterestRateMethod.ReducingBalance },
    { label: 'Amortized', value: InterestRateMethod.Amortized },
    { label: 'Compound', value: InterestRateMethod.Compound },
];

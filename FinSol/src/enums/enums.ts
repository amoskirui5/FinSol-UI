// enums.ts

export enum LoanStatus {
    Pending = 0,
    Applied = 1,
    Approved = 2,
    Declined = 3,
    PartiallyDisbursed = 4,
    Disbursed = 5
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

export enum Gender {
    Unknown = 0,
    Male = 1,
    Female = 2,
}

export const GenderOptions =
    [
        { label: "Unknown", value: Gender.Unknown },
        { label: "Male", value: Gender.Male },
        { label: "Female", value: Gender.Female },
    ]

export enum MemberAccountType {
    Savings = 0,
    Deposits = 1,
    ShareCapital = 2,
    Loan = 3,
    RegistrationFee = 4,
}

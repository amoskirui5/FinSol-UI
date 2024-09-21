import { InterestRateType } from "../enums/enums";

export const getInterestRateTypeName = (interestRateType: number | undefined |string): string => {
    switch (interestRateType) {
        case InterestRateType.PerAnnum:
            return 'Per Annum';
        case InterestRateType.PerMonth:
            return 'Per Month';
        case InterestRateType.PerWeek:
            return 'Per Week';
        case InterestRateType.PerDay:
            return 'Per Day';
        default:
            return 'Unknown';
    }
};
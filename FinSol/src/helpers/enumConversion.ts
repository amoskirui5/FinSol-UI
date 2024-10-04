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

// Generic function to map an enum value to its string representation
export function mapEnumToString<T>(enumType: T, value: number | string): string {
    if (typeof value === 'number') {
      // If value is a number, map it to the corresponding enum string (reverse mapping)
      return (enumType as any)[value] || 'Unknown';
    } else if (typeof value === 'string') {
      // If value is a string, check if it's a valid enum key
      const enumKey = (enumType as any)[value];
      return enumKey !== undefined ? value : 'Unknown';
    }
    return 'Unknown';
  }
  

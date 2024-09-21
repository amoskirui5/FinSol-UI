export const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'KES', 
        minimumFractionDigits: 2,
    }).format(value);
};

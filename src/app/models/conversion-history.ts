export interface ConversionHistory {
    realRate: number;
    customRate: number | null;
    initialAmount: number;
    initialCurrency: string;
    convertedAmount: number;
    convertedCurrency: string;
  }
  
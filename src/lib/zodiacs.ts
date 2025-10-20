export interface Zodiac {
  name: string;
  symbol: string;
  dateRange: string;
  index: number; 
}

export const ZODIACS: Zodiac[] = [
  { name: "ARIES", symbol: "♈", dateRange: "21 MAR - 19 APR", index: 0 },
  { name: "TAURUS", symbol: "♉", dateRange: "20 APR - 20 MAY", index: 1 },
  { name: "GEMINI", symbol: "♊", dateRange: "21 MAY - 20 JUN", index: 2 },
  { name: "CANCER", symbol: "♋", dateRange: "21 JUN - 22 JUL", index: 3 },
  { name: "LEO", symbol: "♌", dateRange: "23 JUL - 22 AUG", index: 4 },
  { name: "VIRGO", symbol: "♍", dateRange: "23 AUG - 22 SEP", index: 5 },
  { name: "LIBRA", symbol: "♎", dateRange: "23 SEP - 22 OCT", index: 6 },
  { name: "SCORPIO", symbol: "♏", dateRange: "23 OCT - 21 NOV", index: 7 },
  { name: "SAGITTARIUS", symbol: "♐", dateRange: "22 NOV - 21 DEC", index: 8 },
  { name: "CAPRICORN", symbol: "♑", dateRange: "22 DEC - 19 JAN", index: 9 },
  { name: "AQUARIUS", symbol: "♒", dateRange: "20 JAN - 18 FEB", index: 10 },
  { name: "PISCES", symbol: "♓", dateRange: "19 FEB - 20 MAR", index: 11 },
];
export interface TokenPrice {
  currency: string;
  price: number;
  date: string;
}

export interface TokenPriceMap {
  [currency: string]: TokenPrice;
}

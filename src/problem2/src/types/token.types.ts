export interface TokenPrice {
  currency: string;
  price: number;
  date: string;
  iconUrl: string;
}

export interface TokenPriceMap {
  [currency: string]: TokenPrice;
}

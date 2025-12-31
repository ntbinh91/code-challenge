import apiInstance from "../apiInstance";
import { API_ENDPOINTS } from "../api.constants";
import type { TokenPrice, TokenPriceMap } from "@/types/token.types";
import { chain } from "lodash";

export const fetchTokenPrices = async (): Promise<TokenPriceMap> => {
  const tokenPrices = await apiInstance.get<TokenPrice[], unknown>(API_ENDPOINTS.TOKEN_PRICES);

  // Group by currency, get the latest price by date for each, and add the icon url
  const tokenPriceMap: TokenPriceMap = chain(tokenPrices)
    .filter((item: TokenPrice) => item.price > 0)
    .sortBy("currency")
    .groupBy("currency")
    .mapValues((items: TokenPrice[]) =>
      items.reduce((latest, current) => {
        return new Date(current.date) > new Date(latest.date) ? current : latest;
      }),
    )
    .value();

  return tokenPriceMap;
};

export const getTokenIconUrl = (currency: string): string => {
  return `${import.meta.env.VITE_TOKEN_ICON_BASE_URL}${currency}.svg`;
};

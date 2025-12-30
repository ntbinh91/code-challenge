import { useQuery } from "@tanstack/react-query";
import { fetchTokenPrices } from "../services/token.services";
import { QUERY_KEYS } from "../api.constants";

export const useTokenPrices = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.TOKEN_PRICES],
    queryFn: fetchTokenPrices,
  });
};

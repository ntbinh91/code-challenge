import { z } from "zod";

export const currencySwapFormSchema = z
  .object({
    fromCurrency: z.string().min(1, "Please select a currency to swap from"),
    toCurrency: z.string().min(1, "Please select a currency to swap to"),
    fromAmount: z
      .string()
      .min(1, "Amount is required")
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Amount must be a positive number",
      }),
    toAmount: z
      .string()
      .min(1, "Amount is required")
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Amount must be a positive number",
      }),
  })
  .refine((data) => data.fromCurrency !== data.toCurrency, {
    message: "Cannot swap the same currency",
    path: ["toCurrency"],
  });

export type CurrencySwapFormData = z.infer<typeof currencySwapFormSchema>;

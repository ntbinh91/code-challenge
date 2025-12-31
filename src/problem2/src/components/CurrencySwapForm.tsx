import { useMemo, useCallback } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftRight, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useTokenPrices } from "../api/api-hooks/token.api-hooks";
import { currencySwapFormSchema, type CurrencySwapFormData } from "../schemas/currencySwapForm.schema";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { getTokenIconUrl } from "@/api/services/token.services";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";
import { currencyFormatter } from "@/helpers/string.helpers";

const DEFAULT_FROM_CURRENCY = "WBTC";
const DEFAULT_TO_CURRENCY = "ETH";

const FORM_FIELDS = {
  fromCurrency: "fromCurrency",
  toCurrency: "toCurrency",
  fromAmount: "fromAmount",
  toAmount: "toAmount",
} as const;

const parseNumberInputValue = (value: string): string => {
  const numericValue = value.replace(/[^0-9.]/g, "");
  return numericValue === "" ? "0" : String(+numericValue);
};

export const CurrencySwapForm = () => {
  const { data: tokenPriceMap, isLoading: isLoadingTokenPriceMap } = useTokenPrices();

  const form = useForm<CurrencySwapFormData>({
    resolver: zodResolver(currencySwapFormSchema),
    defaultValues: {
      fromCurrency: DEFAULT_FROM_CURRENCY,
      toCurrency: DEFAULT_TO_CURRENCY,
      fromAmount: "0",
      toAmount: "0",
    },
  });

  const fromCurrency = useWatch({ control: form.control, name: FORM_FIELDS.fromCurrency });
  const toCurrency = useWatch({ control: form.control, name: FORM_FIELDS.toCurrency });

  const calculateConvertedAmount = useCallback(
    (amount: string, fromCurr: string, toCurr: string): string => {
      if (!tokenPriceMap || !fromCurr || !toCurr) return "0";

      const fromToken = tokenPriceMap[fromCurr];
      const toToken = tokenPriceMap[toCurr];

      if (!fromToken || !toToken) return "0";

      const calculatedValue = (Number(amount) * fromToken.price) / toToken.price;
      return calculatedValue.toFixed(6);
    },
    [tokenPriceMap],
  );

  const onSubmit = useCallback(async (data: CurrencySwapFormData) => {
    // Simulate API call with delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Swap submitted:", data);
    toast.success(
      `Successfully swapped ${data.fromAmount} ${data.fromCurrency} to ${data.toAmount} ${data.toCurrency}!`,
    );
  }, []);

  const handleSwapCurrencies = useCallback(() => {
    const tempFromCurrency = form.getValues(FORM_FIELDS.fromCurrency);
    const tempFromAmount = form.getValues(FORM_FIELDS.fromAmount);
    const tempToCurrency = form.getValues(FORM_FIELDS.toCurrency);
    const tempToAmount = form.getValues(FORM_FIELDS.toAmount);
    form.setValue(FORM_FIELDS.fromCurrency, tempToCurrency, { shouldDirty: true });
    form.setValue(FORM_FIELDS.fromAmount, tempToAmount, { shouldDirty: true });
    form.setValue(FORM_FIELDS.toCurrency, tempFromCurrency, { shouldDirty: true });
    form.setValue(FORM_FIELDS.toAmount, tempFromAmount, { shouldDirty: true });
  }, [form]);

  const handleFromAmountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const amountStr = parseNumberInputValue(e.target.value);
      form.setValue(FORM_FIELDS.fromAmount, amountStr, { shouldDirty: true });

      // Calculate and update the "to" amount
      if (fromCurrency && toCurrency) {
        const converted = calculateConvertedAmount(amountStr, fromCurrency, toCurrency);
        form.setValue(FORM_FIELDS.toAmount, converted, { shouldDirty: true });
      }
    },
    [form, fromCurrency, toCurrency, calculateConvertedAmount],
  );

  const handleToAmountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const amountStr = parseNumberInputValue(e.target.value);
      form.setValue(FORM_FIELDS.toAmount, amountStr, { shouldDirty: true });

      // Calculate and update the "from" amount
      if (fromCurrency && toCurrency) {
        const converted = calculateConvertedAmount(amountStr, toCurrency, fromCurrency);
        form.setValue(FORM_FIELDS.fromAmount, converted, { shouldDirty: true });
      }
    },
    [form, fromCurrency, toCurrency, calculateConvertedAmount],
  );

  const currencyOptions = useMemo(() => Object.values(tokenPriceMap || {}), [tokenPriceMap]);
  const exchangeRate = useMemo(() => {
    if (!tokenPriceMap || !fromCurrency || !toCurrency) return null;

    const fromToken = tokenPriceMap[fromCurrency];
    const toToken = tokenPriceMap[toCurrency];

    if (!fromToken || !toToken) return null;

    return (fromToken.price / toToken.price).toFixed(6);
  }, [tokenPriceMap, fromCurrency, toCurrency]);

  if (isLoadingTokenPriceMap) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="size-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl">Exchange</CardTitle>
        <CardDescription>Swap your tokens at the best rate.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex gap-2 items-center flex-col md:flex-row">
              {/* Left side - from currency and amount */}
              <div className="flex flex-col gap-4 flex-1 border rounded-xl p-4 bg-gray-50 w-full md:w-auto">
                <div className="flex gap-3 items-center justify-between">
                  <h3 className="text-muted-foreground">You send:</h3>
                  <FormField
                    control={form.control}
                    name={FORM_FIELDS.fromCurrency}
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormControl>
                          <Select {...field} onValueChange={field.onChange}>
                            <SelectTrigger
                              className={cn(
                                fieldState.invalid && "border-destructive",
                                "border-none shadow-none outline-0 focus:outline-0",
                              )}
                            >
                              <SelectValue placeholder="Select a currency" />
                            </SelectTrigger>
                            <SelectContent>
                              {currencyOptions.map((option) => (
                                <SelectItem
                                  key={option.currency}
                                  value={option.currency}
                                  disabled={option.currency === toCurrency}
                                >
                                  <div className="flex items-center gap-2">
                                    <Avatar>
                                      <AvatarImage src={getTokenIconUrl(option.currency)} alt={option.currency} />
                                      <AvatarFallback />
                                    </Avatar>
                                    <span className="font-medium">{option.currency}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name={FORM_FIELDS.fromAmount}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={handleFromAmountChange}
                          className="h-auto text-4xl! border-none shadow-none focus-visible:ring-0 p-0 rounded-none"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                  disabled={!fromCurrency}
                />

                <div className="flex items-center gap-2 justify-between">
                  {tokenPriceMap && fromCurrency && (
                    <span className="text-sm text-muted-foreground">
                      1 {fromCurrency}:{" "}
                      <span className="font-medium">{currencyFormatter(tokenPriceMap[fromCurrency]?.price || 0)}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Center - Swap Button */}
              <Button
                type="button"
                variant="ghost"
                onClick={handleSwapCurrencies}
                disabled={!fromCurrency && !toCurrency}
                className="rounded-full"
              >
                <ArrowLeftRight className="size-6" />
              </Button>

              {/* Right side - to currency and amount */}
              <div className="flex flex-col gap-4 flex-1 border rounded-xl p-4 bg-gray-50 w-full md:w-auto">
                <div className="flex gap-3 items-center justify-between">
                  <h3 className="text-muted-foreground">You receive:</h3>
                  <FormField
                    control={form.control}
                    name={FORM_FIELDS.toCurrency}
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormControl>
                          <Select {...field} onValueChange={field.onChange}>
                            <SelectTrigger
                              className={cn(
                                fieldState.invalid && "border-destructive",
                                "border-none shadow-none outline-0 focus:outline-0",
                              )}
                            >
                              <SelectValue placeholder="Select a currency" />
                            </SelectTrigger>
                            <SelectContent>
                              {currencyOptions.map((option) => (
                                <SelectItem
                                  key={option.currency}
                                  value={option.currency}
                                  disabled={option.currency === fromCurrency}
                                >
                                  <div className="flex items-center gap-2">
                                    <Avatar>
                                      <AvatarImage src={getTokenIconUrl(option.currency)} alt={option.currency} />
                                      <AvatarFallback />
                                    </Avatar>
                                    <span className="font-medium">{option.currency}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name={FORM_FIELDS.toAmount}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={handleToAmountChange}
                          className="h-auto text-4xl! border-none shadow-none focus-visible:ring-0 p-0 rounded-none"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                  disabled={!toCurrency}
                />

                <div className="flex items-center gap-2 justify-between">
                  {tokenPriceMap && toCurrency && (
                    <span className="text-sm text-muted-foreground">
                      1 {toCurrency}:{" "}
                      <span className="font-medium">{currencyFormatter(tokenPriceMap[toCurrency]?.price || 0)}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Exchange Rate Display */}
            {exchangeRate && (
              <div className="p-4 bg-gray-50 rounded-xl border">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Exchange Rate</span>
                  <span className="font-medium">
                    1 {fromCurrency} = {exchangeRate} {toCurrency}
                  </span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12"
              disabled={form.formState.isSubmitting || !form.formState.isValid}
            >
              {form.formState.isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  Processing Swap...
                </div>
              ) : (
                "Swap Now"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

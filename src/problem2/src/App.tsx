import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./api/queryClient";
import { CurrencySwapForm } from "./components/CurrencySwapForm";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <CurrencySwapForm />
      </div>
      <Toaster position="top-center" />
    </QueryClientProvider>
  );
}

export default App;

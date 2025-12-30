import { QueryClientProvider } from "@tanstack/react-query";
import { Button } from "./components/ui/button";
import queryClient from "./api/queryClient";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <h1 className="text-3xl font-bold underline text-red-500 bg-amber-400">Hello world!</h1>
      <div className="flex min-h-svh flex-col items-center justify-center">
        <Button>Click me</Button>
      </div>
    </QueryClientProvider>
  );
}

export default App;

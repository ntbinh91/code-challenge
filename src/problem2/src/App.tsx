import { Button } from "./components/ui/button";

function App() {
  return (
    <>
      <h1 className="text-3xl font-bold underline text-red-500 bg-amber-400">Hello world!</h1>
      <div className="flex min-h-svh flex-col items-center justify-center">
        <Button>Click me</Button>
      </div>
    </>
  );
}

export default App;

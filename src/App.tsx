import "./App.css";
import Search from "./Components/Search";

function App() {
  return (
    <div className="container w-full h-full bg-gray-900 py-8 px-16 flex flex-col gap-8">
      <h1 className="text-3xl text-emerald-500">Kanban board</h1>
      <Search />
    </div>
  );
}

export default App;

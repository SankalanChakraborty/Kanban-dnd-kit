import Login from "./Components/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./Components/Homepage";
import { Navigate, Outlet } from "react-router-dom";
import { useUserContext } from "./Context/UserContext";
import Spinner from "./Components/Spinner";

function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useUserContext();

  if (isLoading)
    return (
      <div className="w-full h-full flex justify-center items-center bg-[linear-gradient(135deg,#020617_0%,#0f172a_55%,#1e293b_100%)]">
        <Spinner />
      </div>
    );
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Homepage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

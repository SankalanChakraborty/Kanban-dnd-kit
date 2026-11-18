import Login from "./Components/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Board from "./Components/Board";
import { Navigate, Outlet } from "react-router-dom";
import { useUserContext } from "./Context/UserContext";
import Spinner from "./Components/Spinner";
import ResetPw from "./Components/ResetPw";
import AddWorkspace from "./Components/AddWorkspace";
import WelcomeScreen1 from "./Components/WelcomeScreen1";
import WelcomeScreen2 from "./Components/WelcomeScreen2";
import WaitForInviteModdal from "./Components/WaitForInviteModdal";
import InviteCodeModal from "./Components/InviteCodeModal";
import WorkspaceLandingPage from "./Components/WorkspaceLandingPage";
import Invitations from "./Components/Invitations";
import VerifyEmailModal from "./Components/VerifyEmailModal";

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
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPw />} />
        {/* Testing  */}
        <Route path="/welcome1" element={<WelcomeScreen1 />} />
        <Route path="/welcome2" element={<WelcomeScreen2 />} />
        <Route path="/wait-for-invite" element={<WaitForInviteModdal />} />
        <Route path="/invite-code" element={<InviteCodeModal />} />
        <Route path="/landing-page" element={<WorkspaceLandingPage />} />
        <Route path="/invitations-modal" element={<Invitations />} />
        <Route path="/email-verify" element={<VerifyEmailModal />} />

        {/* Testing */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Board />} />
          <Route path="/create-workspace" element={<AddWorkspace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

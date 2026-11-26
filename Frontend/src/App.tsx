import Login from "./Components/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Board from "./Components/Board";
import { Navigate, Outlet } from "react-router-dom";
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
import WorkspaceBootstrap from "./Components/WorkspaceBootstrap";
import { useAppDispatch, useAppSelector } from "./redux/store/hooks";
import { clearUser, fetchCurrentUser } from "./redux/slice/userSlice";
import { useEffect } from "react";
import { AUTH_EXPIRED_EVENT } from "./api/authenticatedFetch";

function ProtectedRoute() {
  const dispatch = useAppDispatch();
  const status = useAppSelector((s) => s.user.status);

  useEffect(() => {
    if (status === "idle") dispatch(fetchCurrentUser());
  }, [status, dispatch]);

  useEffect(() => {
    const onExpired = () => dispatch(clearUser());
    window.addEventListener(AUTH_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, onExpired);
  }, [dispatch]);

  if (status === "idle" || status === "pending") return <Spinner />;
  return status === "succeeded" ? <Outlet /> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPw />} />

        {/* Testing  */}
        <Route path="/wait-for-invite" element={<WaitForInviteModdal />} />
        <Route path="/invite-code" element={<InviteCodeModal />} />

        <Route path="/invitations-modal" element={<Invitations />} />
        <Route path="/email-verify" element={<VerifyEmailModal />} />

        {/* Testing */}

        <Route element={<ProtectedRoute />}>
          <Route element={<WorkspaceBootstrap />}>
            <Route path="/" element={<Board />} />
            <Route path="/welcome1" element={<WelcomeScreen1 />} />
            <Route path="/welcome2" element={<WelcomeScreen2 />} />
            <Route path="/landing-page" element={<WorkspaceLandingPage />} />
            <Route path="/create-workspace" element={<AddWorkspace />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

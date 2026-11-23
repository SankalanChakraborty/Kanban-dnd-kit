import { useEffect } from "react";

import Button from "./shared/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store/store";
import { fetchCurrentUser } from "../redux/slice/userSlice";

const WelcomeScreen1 = () => {
  const navigate = useNavigate();
  const status = useSelector((s: RootState) => s.user.status);
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector((s: RootState) => s.user.user);
  const userName = user?.name.split(" ")[0];

  useEffect(() => {
    if (status === "idle") dispatch(fetchCurrentUser());
  }, [status, dispatch]);

  const handleCreateWorkspacehandler = async () => {
    navigate("/welcome2");
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 font-sans transition-colors duration-300 dark bg-slate-950 text-slate-100">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-36 -left-36 w-96 h-96 bg-indigo-500/20 dark:bg-indigo-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -right-36 w-96 h-96 bg-fuchsia-500/15 dark:bg-purple-600/15 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
        <div className="absolute -bottom-36 left-1/3 w-96 h-96 bg-cyan-500/15 dark:bg-blue-600/15 rounded-full blur-3xl animate-pulse [animation-delay:4s]" />
        <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] bg-size-[24px_24px] opacity-[0.03] dark:opacity-[0.06]" />
      </div>
      <div className="flex flex-col max-w-md p-6 bg-[#0B1220] justify-center items-center gap-3 rounded-xl shadow-lg">
        <p className="text-xs text-[#818CF8]">Step 1 OF 2</p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          width="52"
          height="52"
          viewBox="454 85 52 52"
        >
          <defs />
          <g />
          <g />
          <g />
          <g />
          <g />
          <g />
          <g />
          <g id="div1">
            <g>
              <rect
                width="52"
                height="52"
                x="454"
                y="85"
                fill="rgb(79, 70, 229)"
                rx="14"
                ry="14"
              />
            </g>
            <text
              color="rgb(226, 232, 240)"
              dominant-baseline="text-after-edge"
              font-family="Inter, system-ui, sans-serif"
              font-size="24px"
              font-size-adjust="none"
              font-stretch="100%"
              font-style="normal"
              font-variant="normal"
              font-weight="400"
              direction="ltr"
              letter-spacing="normal"
              text-decoration="none"
              text-anchor="start"
              text-rendering="auto"
              unicode-bidi="isolate"
              word-spacing="0px"
              writing-mode="horizontal-tb"
              user-select="text"
              fill="rgb(226, 232, 240)"
            >
              <tspan
                xmlSpace="preserve"
                x="468"
                y="124.25"
                textLength="24"
                lengthAdjust="spacingAndGlyphs"
              >
                👋
              </tspan>
            </text>
          </g>
        </svg>
        <div className="welcome-header flex flex-col items-center">
          <h3 className="text-xl font-bold text-[#E2E8F0]">
            Welcome, {userName}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
            Set up a workspace to get started.
          </p>
        </div>
        <div className="flex flex-col w-full p-4 bg-[#111a2e] border border-slate-700/70 rounded-xl shadow-lg backdrop-blur-sm">
          <h3 className="text-md font-bold text-slate-900 dark:text-white">
            Create a new workspace
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-3">
            For you or your company. You will be the Owner.
          </p>
          <Button
            buttonStyle="primary"
            type="button"
            additionalStyles="w-full"
            onClick={handleCreateWorkspacehandler}
          >
            Create Workspace
          </Button>
        </div>
        <div className="flex flex-col w-full p-4 bg-[#111a2e] border border-slate-700/70 rounded-xl shadow-lg backdrop-blur-sm">
          <h3 className="text-md font-bold text-slate-900 dark:text-white">
            Join with an invite code
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-3">
            Got a code from a teammate?
          </p>
          <Button
            type="button"
            buttonStyle="secondary"
            additionalStyles="w-full"
          >
            Enter Code
          </Button>
        </div>
        <div className="flex flex-col gap-1 justify-center items-center">
          <a className="text-sm text-[#818CF8]" href="#">
            I am waiting for an invite
          </a>
          <a className="text-sm text-[#818CF8]" href="#">
            Sign Out
          </a>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen1;

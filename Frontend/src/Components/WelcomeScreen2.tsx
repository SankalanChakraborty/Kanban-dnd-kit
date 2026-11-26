import { useState } from "react";
import Button from "./shared/Button";
// import { createWorkspace } from "../api/workspace";
import { useNavigate } from "react-router-dom";
import { useToastContext } from "../Context/ToastContext";
import { useAppDispatch } from "../redux/store/hooks";
import { createWorkspaceThunk } from "../redux/slice/workspaeSlice";

const WelcomeScreen2 = () => {
  const [workspaceName, setWorkspaceName] = useState("");
  const [isError, setIsError] = useState(false);
  const [teamSize, setTeamSize] = useState("");
  const navigate = useNavigate();
  const { showToast } = useToastContext();
  const dispatch = useAppDispatch();

  const handleWorkspaceNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.value.trim().length <= 2) {
      setIsError(true);
    } else {
      setIsError(false);
    }
    setWorkspaceName(e.target.value);
  };

  const handleTeamSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeamSize(e.target.value);
  };

  const handleCreateWorkspacehandler = async () => {
    try {
      // const data = await createWorkspace(workspaceName);
      const data = await dispatch(createWorkspaceThunk(workspaceName)).unwrap();
      console.log(data);

      if (data.code === "WORKSPACE_CREATED") {
        showToast(data.message, "success");
        navigate("/landing-page");
      } else {
        // showToast(data.message || "Workspace cannot be created", "error");
      }
    } catch (error) {
      console.error("Error ", error);
      const err = error as { message?: string; code?: string };
      showToast(err.message ?? "An unexpected error occurred.", "error");
    } finally {
      setWorkspaceName("");
      setTeamSize("");
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 font-sans transition-colors duration-300 dark bg-slate-950 text-slate-100">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-36 -left-36 w-96 h-96 bg-indigo-500/20 dark:bg-indigo-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -right-36 w-96 h-96 bg-fuchsia-500/15 dark:bg-purple-600/15 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
        <div className="absolute -bottom-36 left-1/3 w-96 h-96 bg-cyan-500/15 dark:bg-blue-600/15 rounded-full blur-3xl animate-pulse [animation-delay:4s]" />
        <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] bg-size-[24px_24px] opacity-[0.03] dark:opacity-[0.06]" />
      </div>
      <div className="flex flex-col max-w-sm p-6 bg-[#0B1220] justify-center items-center gap-3 rounded-xl shadow-lg">
        <p className="text-xs text-[#818CF8]">Step 2 OF 2</p>
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
                🏢
              </tspan>
            </text>
          </g>
        </svg>
        <div className="flex flex-col justify-center items-center gap-1">
          <h3 className="text-xl font-bold text-[#E2E8F0]">
            Name your workspace
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
            This is usually your company or organization name.
          </p>
        </div>
        <div className="flex flex-col gap-1 w-full">
          <div className="flex flex-col">
            <div className="flex justify-between">
              <label
                className="block text-xs font-medium tracking-wider text-slate-600 dark:text-slate-400 mb-1.5"
                htmlFor="workspaceName"
              >
                Workspace Name
              </label>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                0/50
              </span>
            </div>
            <input
              id="workspaceName"
              type="text"
              value={workspaceName}
              onChange={handleWorkspaceNameChange}
              placeholder="e.g. Acme Inc."
              className={`w-full text-sm text-slate-200 placeholder-slate-500 bg-slate-800/60 border border-slate-700/70 rounded-xl p-3 outline-none  ${isError ? "focus:ring-1 focus:border-b-red-500 focus:ring-red-500" : "focus:ring-2 focus:border-indigo-500 focus:ring-indigo-500/20"} transition-all`}
            />
            {isError && (
              <p className="text-[#FCA5A5] text-xs my-2">
                Workspace name cannot be empty and must be atleast 3 characters
                long.
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1 w-full">
          <div className="flex flex-col">
            <label
              className="block text-xs font-medium tracking-wider text-slate-600 dark:text-slate-400 mb-1.5"
              htmlFor="teamSize"
            >
              Team Size (Optional)
            </label>

            <input
              id="teamSize"
              type="text"
              value={teamSize}
              onChange={handleTeamSizeChange}
              placeholder="Select team size..."
              className="w-full text-sm text-slate-200 placeholder-slate-500 bg-slate-800/60 border border-slate-700/70 rounded-xl p-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1 justify-center items-center w-full">
          {isError || !workspaceName ? (
            <Button
              buttonStyle="disabled"
              disabled={isError || !workspaceName}
              type="submit"
              additionalStyles="w-full"
            >
              Create workspace
            </Button>
          ) : (
            <Button
              type="button"
              disabled={isError}
              buttonStyle="primary"
              additionalStyles="w-full"
              onClick={handleCreateWorkspacehandler}
            >
              Create Workspace
            </Button>
          )}
          <a className="text-sm text-[#818CF8]" href="#">
            Back
          </a>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen2;

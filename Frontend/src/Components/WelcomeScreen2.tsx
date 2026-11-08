import { useState } from "react";

const WelcomeScreen2 = () => {
  const [workspaceName, setWorkspaceName] = useState("");
  const [teamSize, setTeamSize] = useState("");

  const handleWorkspaceNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setWorkspaceName(e.target.value);
  };

  const handleTeamSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeamSize(e.target.value);
  };

  return (
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
            placeholder="Enter workspace name..."
            className="w-full text-sm text-slate-200 placeholder-slate-500 bg-slate-800/60 border border-slate-700/70 rounded-xl p-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
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
        {!workspaceName ? (
          <button className="px-4 py-2.5 rounded-xl text-sm font-medium  w-full flex justify-center items-center bg-slate-700 text-white font-bold rounded-xl">
            Create workspace
          </button>
        ) : (
          <button
            type="button"
            className="px-4 py-2.5 rounded-xl text-sm font-semibold w-full flex justify-center items-center text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all"
          >
            Create Workspace
          </button>
        )}
        <a className="text-sm text-[#818CF8]" href="#">
          Back
        </a>
      </div>
    </div>
  );
};

export default WelcomeScreen2;

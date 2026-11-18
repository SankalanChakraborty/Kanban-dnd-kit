import Button from "./shared/Button";

const invitations = [
  {
    fromWorkSpace: "Acme Inc.",
    role: "Member",
    invitedBy: "Riya Sen",
  },
  {
    fromWorkSpace: "Delta Design",
    role: "Viewer",
    invitedBy: "Priya Rao",
  },
];

const Invitations = () => {
  return (
    <div className="flex flex-col max-w-sm p-6 bg-[#0B1220] justify-center items-center gap-3 rounded-xl shadow-lg">
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
              ✉️
            </tspan>
          </text>
        </g>
      </svg>
      <div className="welcome-header flex flex-col items-center">
        <h3 className="text-xl font-bold text-[#E2E8F0]">
          You have {invitations.length} invitations
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
          Join a workspace to get started.
        </p>
      </div>
      {invitations.map((invite) => (
        <div className="flex flex-col w-full p-4 bg-[#111a2e] border border-slate-700/70 rounded-xl shadow-lg backdrop-blur-sm">
          <h3 className="text-md font-bold text-slate-900 dark:text-white">
            {invite.fromWorkSpace}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-3">
            Role {invite.role} · Invited by {invite.invitedBy}
          </p>
          <div className="flex gap-1">
            <Button
              buttonStyle={"primary"}
              type={"submit"}
              additionalStyles={"w-full"}
            >
              Accept
            </Button>
            <Button
              buttonStyle={"secondary"}
              type={"submit"}
              additionalStyles={"w-full"}
            >
              Decline
            </Button>
          </div>
        </div>
      ))}

      <div className="or-div flex justify-center items-center gap-1 w-full">
        <div className="h-0 w-40 border border-b-0 border-slate-600"></div>
        <span className="text-sm text-slate-500 dark:text-slate-400 font-semibold mx-3">
          OR
        </span>
        <div className="h-0 w-40 border border-b-0 border-slate-600"></div>
      </div>
      <Button buttonStyle="secondary" type="button" additionalStyles={"w-full"}>
        Create a workspace instead
      </Button>
    </div>
  );
};

export default Invitations;

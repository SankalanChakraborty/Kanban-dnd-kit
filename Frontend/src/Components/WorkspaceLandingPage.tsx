import { useSelector } from "react-redux";
import Button from "../Components/shared/Button";
import UserDropdown from "./shared/UserDropdown";
import WorkspaceMemberList from "./WorkspaceMemberList";
import type { RootState } from "../redux/store/store";
import { useEffect, useState } from "react";

interface ActioRowProps {
  idx: number;
  title: string;
  description: string;
  buttonPrimary: boolean;
  buttonLabel: string;
  border: string;
}

const ActionRow = ({
  idx,
  title,
  description,
  buttonPrimary,
  buttonLabel,
  border = "none",
}: ActioRowProps) => {
  return (
    <div
      className={`row flex gap-2 py-4 ${
        border !== "none" ? "border-b-2 border-slate-700/70" : ""
      }`}
    >
      <div className="index w-7 h-7 text-sm rounded-full flex justify-center items-center shrink-0 text-slate-300 border border-slate-600">
        {idx}
      </div>
      <div className="row-info flex flex-col gap-2 ">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
            {description}
          </p>
        </div>

        {buttonPrimary ? (
          <Button
            buttonStyle={"primary"}
            type="submit"
            additionalStyles={"w-fit"}
          >
            {buttonLabel}
          </Button>
        ) : (
          <Button
            buttonStyle={"secondary"}
            type="button"
            additionalStyles={"w-fit"}
          >
            {buttonLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

const rowInfo = [
  {
    id: 1,
    title: "Create your first board",
    description: "Boards hold your tasks in columns like To do and Done.",
    buttonPrimary: true,
    buttonLabel: "Create board",
  },
  {
    id: 2,
    title: "Invite people",
    description: "Add teammates by email. You can change roles later.",
    buttonPrimary: false,
    buttonLabel: "Invite people",
  },
  {
    id: 3,
    title: "Create a team (optional)",
    description: "Group people like Design or Engineering. You can skip this.",
    buttonPrimary: false,
    buttonLabel: "Create team",
  },
];

const memberList = [
  {
    name: "Alex morgan",
    email: "test@test.com",
    isOwner: true,
  },
];

const WorkspaceLandingPage = () => {
  const user = useSelector((s: RootState) => s.user.user);
  const userName = user?.name;
  const workspaces = useSelector((w: RootState) => w.workspace.list);
  const [activeWorkspace, setActiveWorkspace] = useState("");

  useEffect(() => {
    console.log(workspaces);
  }, []);

  return (
    <div className="flex flex-col w-full bg-[#0B1220] py-8 px-12">
      <div className="flex justify-between items-center">
        <div className="current-workspace flex justify-between">
          <div className="workspace-badging flex justify-center items-center p-3 rounded-lg bg-[#111a2e] gap-2 border border-slate-700/70">
            <div className="w-7 h-7 circle rounded-full p-1 flex justify-center items-center text-sm text-slate-100 bg-amber-700 shrink-0">
              W
            </div>
            <span className="text-md font-bold text-[#E2E8F0] dark:text-white">
              Workspace Name
            </span>
            <span className="px-2 border text-xs text-[#E2E8F0] border-indigo-600 hover:border-indigo-700 rounded-full">
              Owner
            </span>
          </div>
        </div>
        <UserDropdown user={"Alex"} />
      </div>
      <div className="page-header flex flex-col mt-10 mb-10">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Your workspace is ready, {userName?.split(" ")[0]}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-3">
          You created Northwind Labs, so you are its Owner. Here is how to get
          set up.
        </p>
      </div>
      <div className="action-container flex justify-between">
        <div className="right-actions p-5 border rounded-lg border-slate-700/70 bg-[#111a2e]">
          <div className="flex flex-col border-b-2 border-slate-700/70">
            <h2 className="text-md font-bold text-slate-900 dark:text-white">
              Getting started
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-2">
              0 of 3 done
            </p>
          </div>

          <div className="workspace-info">
            {rowInfo.map((row) => (
              <ActionRow
                idx={row.id}
                title={row.title}
                description={row.description}
                buttonPrimary={row.buttonPrimary}
                buttonLabel={row.buttonLabel}
                border={row.id === 3 ? "none" : ""}
              />
            ))}
          </div>
        </div>
        <div className="left-workspace-info h-fit flex flex-col rounded-lg bg-[#111a2e] p-5 gap-3 border border-slate-700/70">
          <h2 className="text-md font-bold text-slate-900 dark:text-white">
            Members · 1
          </h2>
          {memberList.map((member) => (
            <WorkspaceMemberList
              memberName={member.name}
              email={member.email}
              isOwner={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkspaceLandingPage;

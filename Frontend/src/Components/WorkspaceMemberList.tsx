interface MemberListProps {
  memberName: string;
  email: string;
  isOwner: boolean;
}

const WorkspaceMemberList = ({
  memberName,
  email,
  isOwner,
}: MemberListProps) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-5 justify-between border-b-2 border-slate-700/70">
        <div className="flex gap-3 mb-3">
          <div className="w-7 h-7 bg-indigo-300 flex justify-center items-center rounded-full shrink-0">
            {memberName.slice(0, 1)}
          </div>
          <div className="member-info flex flex-col gap-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {memberName}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {email}
            </p>
          </div>
        </div>
        {isOwner ? (
          <span className="text-slate-500 text-xs font-semibold">Owner</span>
        ) : (
          <span className="text-slate-500 text-xs font-semibold">Member</span>
        )}
      </div>
      <span className="text-slate-500 text-xs font-semibold">
        You are the only member. Invite people to collaborate.
      </span>
    </div>
  );
};

export default WorkspaceMemberList;

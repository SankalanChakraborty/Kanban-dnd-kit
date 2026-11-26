import { useModalContext } from "../Context/ModalContext";

const AddWorkspace = () => {
  const { setIsCreateWorkspaceModalOpen } = useModalContext();
  const roles = [
    { value: "admin", label: "Admin" },
    { value: "member", label: "Member" },
  ];

  return (
    <div className="absolute inset-0 z-50 flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#020617CC_0%,#0f172aCC_55%,#1e293bCC_100%)]">
      <div className="add-modal w-full px-6 py-8 max-w-lg bg-[#111a2e] border border-slate-700/70 rounded-xl shadow-lg backdrop-blur-sm">
        <div className="modal-header flex flex-col">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Create a new workspace
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-5">
            A workspace holds your team's boards and members.
          </p>
        </div>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
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
              placeholder="Enter workspace name..."
              className="w-full text-sm text-slate-200 placeholder-slate-500 bg-slate-800/60 border border-slate-700/70 rounded-xl p-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
          {/* <div className="flex flex-col">
            <label
              className="block text-xs tracking-wider text-slate-600 dark:text-slate-400 mb-1.5"
              htmlFor="workspaceDescription"
            >
              Description (Optional)
            </label>
            <textarea
              id="workspaceDescription"
              rows={4}
              placeholder="Add a description for your workspace..."
              className="w-full text-sm text-slate-200 placeholder-slate-500 bg-slate-800/60 border border-slate-700/70 rounded-xl p-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none leading-relaxed"
            />
          </div> */}
          <div className="flex flex-col">
            <label className="block text-xs tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Add members (optional)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter workspace name..."
                className="w-full text-sm text-slate-200 placeholder-slate-500 bg-slate-800/60 border border-slate-700/70 rounded-xl p-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
              <select className="text-sm text-slate-200 placeholder-slate-500 bg-slate-800/60 border border-slate-700/70 rounded-xl p-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all">
                {roles.map((role) => (
                  <option value={role.value}>{role.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="p-2">
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-5">
              Everyone you add gets an email invite. You become the Owner.
            </p>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              onClick={() => setIsCreateWorkspaceModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
            >
              Create Workspace
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWorkspace;

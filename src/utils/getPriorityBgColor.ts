const getPriorityBgColor = (priority: string) => {
  switch (priority) {
    case "low":
      return "bg-emerald-300";
    case "medium":
      return "bg-amber-500";
    case "high":
      return "bg-rose-500";
    default:
      return "bg-slate-500";
  }
};

export default getPriorityBgColor;

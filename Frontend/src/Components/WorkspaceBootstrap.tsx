import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/store/hooks";
import type { RootState } from "../redux/store/store";
import { fetchMyWorkspaces } from "../redux/slice/workspaeSlice";
import Spinner from "./Spinner";

const WorkspaceBootstrap = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector((s: RootState) => s.workspace.fetchStatus);
  const error = useAppSelector((s: RootState) => s.workspace.fetchError);

  useEffect(() => {
    if (status === "idle") dispatch(fetchMyWorkspaces());
  }, [status, dispatch]);

  if (status === "loading" || status === "idle") return <Spinner />;

  if (status === "failed") return <p>{error?.message}</p>;

  return <Outlet />;
};

export default WorkspaceBootstrap;

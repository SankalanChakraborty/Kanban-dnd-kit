import { Eye, EyeOff, KeyRound, Loader2, Lock, X } from "lucide-react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../api/user";

const ResetPw = () => {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [showSignInPass, setShowSignInPass] = useState(false);
  const [isResetLoading, setResetLoading] = useState(false);
  const navigate = useNavigate();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const redirectToLogin = () => {
    navigate("/login");
  };

  const isValidPassword = (password: string) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const resetPasswordHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResetLoading(true);
    try {
      const token = searchParams.get("token");
      const data = await resetPassword(token, newPassword);
      console.log("Password reset response:", data);
      if (data.status === "success") {
        alert(
          "Password reset successful! Please log in with your new password.",
        );
        navigate("/login");
        setResetLoading(false);
      } else {
        alert(data.message || "Password reset failed. Please try again.");
        setResetLoading(false);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      setResetLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-200 bg-[linear-gradient(135deg,#020617_0%,#0f172a_55%,#1e293b_100%)]">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <KeyRound className="w-5 h-5" />
          </div>
          <button
            type="button"
            onClick={redirectToLogin}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Reset password
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-5">
          Password should be at least 8 characters long and include a mix of
          uppercase, lowercase, numbers, and special characters.
        </p>
        <form onSubmit={resetPasswordHandler} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              New Password
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type={showSignInPass ? "text" : "password"}
                  value={newPassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm transition-all outline-none bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 ${
                    !isValidPassword
                      ? "border-rose-500 focus:ring-2 focus:ring-rose-500/30"
                      : "border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowSignInPass(!showSignInPass)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showSignInPass ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={redirectToLogin}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isResetLoading}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
            >
              {isResetLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isResetLoading ? "Resetting..." : "Reset"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPw;

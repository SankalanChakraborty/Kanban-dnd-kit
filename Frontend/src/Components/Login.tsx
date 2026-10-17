import { useState, useEffect, useMemo } from "react";
import type { FormEvent } from "react";
import {
  Sun,
  Moon,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Info,
  X,
  ShieldCheck,
  KeyRound,
  Loader2,
  Zap,
} from "lucide-react";
import { login } from "../api/user";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../Context/UserContext";

type AuthTab = "signin" | "signup";
type ToastType = "info" | "success" | "error";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface SignInErrors {
  emailOrUser?: string;
  password?: string;
}

interface SignUpErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

export default function Login() {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useUserContext();
  // Theme state
  const [isDark, setIsDark] = useState(true);

  // Auth mode: 'signin' | 'signup'
  const [tab, setTab] = useState<AuthTab>("signin");

  // Sign In form state
  const [signInData, setSignInData] = useState({
    emailOrUser: "",
    password: "",
    rememberMe: false,
  });
  const [signInErrors, setSignInErrors] = useState<SignInErrors>({});
  const [showSignInPass, setShowSignInPass] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Sign Up form state
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [signUpErrors, setSignUpErrors] = useState<SignUpErrors>({});
  const [showSignUpPass, setShowSignUpPass] = useState(false);
  const [showSignUpConfirmPass, setShowSignUpConfirmPass] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);

  // Forgot password modal
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  // Toast notifications stack
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync theme with html root class
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  // Toast dispatcher
  const addToast = (message: string, type: ToastType = "info") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Password strength calculator
  const passwordStrength = useMemo(() => {
    const pwd = signUpData.password;
    if (!pwd)
      return {
        score: 0,
        text: "Too weak",
        color: "bg-slate-300 dark:bg-slate-700",
        textColor: "text-slate-400",
      };

    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    switch (score) {
      case 1:
        return {
          score: 1,
          text: "Weak",
          color: "bg-rose-500",
          textColor: "text-rose-500",
        };
      case 2:
        return {
          score: 2,
          text: "Fair",
          color: "bg-amber-500",
          textColor: "text-amber-500",
        };
      case 3:
        return {
          score: 3,
          text: "Good",
          color: "bg-indigo-500",
          textColor: "text-indigo-500",
        };
      case 4:
        return {
          score: 4,
          text: "Strong",
          color: "bg-emerald-500",
          textColor: "text-emerald-500",
        };
      default:
        return {
          score: 0,
          text: "Too weak",
          color: "bg-slate-300 dark:bg-slate-700",
          textColor: "text-slate-400",
        };
    }
  }, [signUpData.password]);

  // Validation helpers
  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Handle Sign In submission
  const handleSignInSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors: SignInErrors = {};

    if (!signInData.emailOrUser.trim()) {
      errors.emailOrUser = "Email or username is required";
    }
    if (!signInData.password) {
      errors.password = "Password is required";
    } else if (signInData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setSignInErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const data = await login(signInData.emailOrUser, signInData.password);
    console.log(data);
    if (data.status === "success") {
      setIsLoggedIn(true);
      navigate("/");
      setIsSigningIn(true);
      setTimeout(() => {
        setIsSigningIn(false);
        addToast(
          `Welcome back, ${signInData.emailOrUser}! Successfully logged in.`,
          "success",
        );
      }, 1200);
    }
  };

  // Handle Sign Up submission
  const handleSignUpSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors: SignUpErrors = {};

    if (!signUpData.name.trim()) {
      errors.name = "Full name is required";
    }
    if (!signUpData.email.trim()) {
      errors.email = "Email address is required";
    } else if (!validateEmail(signUpData.email)) {
      errors.email = "Please provide a valid email";
    }
    if (!signUpData.password) {
      errors.password = "Password is required";
    } else if (signUpData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }
    if (!signUpData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (signUpData.password !== signUpData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    if (!signUpData.terms) {
      errors.terms = "You must agree to the terms to proceed";
    }

    setSignUpErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSigningUp(true);
    setTimeout(() => {
      setIsSigningUp(false);
      addToast(
        `Account created for ${signUpData.name}! Please sign in.`,
        "success",
      );
      setSignUpData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        terms: false,
      });
      setTab("signin");
    }, 1400);
  };

  // Handle Forgot Password submission
  const handleForgotSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!forgotEmail.trim() || !validateEmail(forgotEmail)) {
      addToast("Please enter a valid email address.", "error");
      return;
    }

    setForgotLoading(true);
    setTimeout(() => {
      setForgotLoading(false);
      setIsForgotModalOpen(false);
      const sentTo = forgotEmail;
      setForgotEmail("");
      addToast(`Password recovery link sent to ${sentTo}!`, "success");
    }, 1100);
  };

  // Social Auth mock trigger
  const handleSocialAuth = (provider: string) => {
    addToast(`Connecting to ${provider}...`, "info");
    setTimeout(() => {
      addToast(`Authenticated via ${provider}!`, "success");
    }, 1200);
  };

  return (
    <div
      className={`min-h-screen relative flex items-center justify-center p-4 sm:p-6 font-sans transition-colors duration-300 ${isDark ? "dark bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800"}`}
    >
      {/* Background Animated Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-36 -left-36 w-96 h-96 bg-indigo-500/20 dark:bg-indigo-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -right-36 w-96 h-96 bg-fuchsia-500/15 dark:bg-purple-600/15 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
        <div className="absolute -bottom-36 left-1/3 w-96 h-96 bg-cyan-500/15 dark:bg-blue-600/15 rounded-full blur-3xl animate-pulse [animation-delay:4s]" />
        <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] bg-size-[24px_24px] opacity-[0.03] dark:opacity-[0.06]" />
      </div>

      {/* Theme Switcher in top right */}
      <header className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30">
        <button
          type="button"
          onClick={() => setIsDark(!isDark)}
          aria-label="Toggle color theme"
          className="p-2.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 text-slate-700 dark:text-slate-300 shadow-sm hover:scale-105 active:scale-95 backdrop-blur-md transition-all duration-200"
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-indigo-600" />
          )}
        </button>
      </header>

      {/* Toast Notification Container */}
      <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 max-w-sm w-full px-4 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl shadow-xl border text-sm font-medium backdrop-blur-md transition-all animate-bounce-short ${
              toast.type === "success"
                ? "bg-white/95 dark:bg-slate-900/95 border-emerald-500/40 text-emerald-800 dark:text-emerald-300"
                : toast.type === "error"
                  ? "bg-white/95 dark:bg-slate-900/95 border-rose-500/40 text-rose-800 dark:text-rose-300"
                  : "bg-white/95 dark:bg-slate-900/95 border-indigo-500/40 text-indigo-800 dark:text-indigo-300"
            }`}
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              {toast.type === "success" && (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              )}
              {toast.type === "error" && (
                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
              )}
              {toast.type === "info" && (
                <Info className="w-5 h-5 text-indigo-500 shrink-0" />
              )}
              <span className="truncate">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <KeyRound className="w-5 h-5" />
              </div>
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Reset password
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-5">
              Enter your email address and we'll dispatch a secure recovery
              link.
            </p>
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm"
                  />
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
                >
                  {forgotLoading && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  <span>{forgotLoading ? "Sending..." : "Send Link"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="relative z-10 w-full max-w-120">
        <div className="backdrop-blur-xl bg-white/85 dark:bg-slate-900/85 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl shadow-[0_20px_50px_rgba(8,112,184,0.07)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.6)] p-6 sm:p-9 transition-all duration-300">
          {/* Brand Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-linear-to-tr from-indigo-600 to-indigo-400 text-white shadow-lg shadow-indigo-500/30 mb-3.5">
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {tab === "signin" ? "Welcome back" : "Create an account"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {tab === "signin"
                ? "Please enter your credentials to access your account."
                : "Join thousands of creators and teams worldwide."}
            </p>
          </div>

          {/* Tab Selector */}
          <div className="relative bg-slate-100/90 dark:bg-slate-800/90 p-1.5 rounded-2xl mb-6 flex items-center border border-slate-200/50 dark:border-slate-700/50">
            <div
              className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-black/5 dark:border-white/5 transition-transform duration-300 ease-out ${
                tab === "signup"
                  ? "translate-x-[calc(100%+6px)]"
                  : "translate-x-0"
              }`}
            />
            <button
              type="button"
              onClick={() => {
                setTab("signin");
                setSignInErrors({});
              }}
              className={`relative z-10 w-1/2 py-2 text-sm font-semibold rounded-xl transition-colors duration-200 focus:outline-none ${
                tab === "signin"
                  ? "text-slate-900 dark:text-white"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setTab("signup");
                setSignUpErrors({});
              }}
              className={`relative z-10 w-1/2 py-2 text-sm font-semibold rounded-xl transition-colors duration-200 focus:outline-none ${
                tab === "signup"
                  ? "text-slate-900 dark:text-white"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Social Auth Buttons */}
          <div className="space-y-3 mb-6">
            <div className="grid grid-cols-3 gap-2.5">
              {/* Google */}
              <button
                type="button"
                disabled={true}
                onClick={() => handleSocialAuth("Google")}
                className="disabled:opacity-75 flex items-center justify-center py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white/70 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-xs"
              >
                {/* Styles to add
                 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all active:scale-95 */}

                <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span className="hidden sm:inline">Google</span>
              </button>

              {/* GitHub */}
              <button
                type="button"
                disabled={true}
                onClick={() => handleSocialAuth("GitHub")}
                className="disabled:opacity-75 flex items-center justify-center py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white/70 dark:bg-slate-800/60 text-slate-700  dark:text-slate-200 text-xs font-semibold shadow-xs"
              >
                {/* Styles to add 
                hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-all active:scale-95 */}
                <svg
                  className="w-4 h-4 mr-1.5 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
                <span className="hidden sm:inline">GitHub</span>
              </button>

              {/* Apple */}
              <button
                type="button"
                disabled={true}
                onClick={() => handleSocialAuth("Apple")}
                className="disabled:opacity-75 flex items-center justify-center py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white/70 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-xs"
              >
                {/* Styles to add
                hover:bg-slate-50 dark:hover:bg-slate-800  hover:border-slate-300 dark:hover:border-slate-600 transition-all active:scale-95 */}
                <svg
                  className="w-4 h-4 mr-1.5 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.36c.64-.78 1.08-1.86.96-2.94-.93.04-2.05.62-2.7 1.39-.58.67-1.09 1.77-.95 2.83 1.04.08 2.06-.5 2.69-1.28z" />
                </svg>
                <span className="hidden sm:inline">Apple</span>
              </button>
            </div>

            <div className="relative flex items-center justify-center py-2">
              <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
              <span className="bg-white/90 dark:bg-slate-900/90 px-3 text-xs uppercase tracking-wider text-slate-400 font-medium absolute">
                or continue with email
              </span>
            </div>
          </div>

          {/* Sign In Form */}
          {tab === "signin" && (
            <form
              onSubmit={handleSignInSubmit}
              className="space-y-4"
              noValidate
            >
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Email or Username
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={signInData.emailOrUser}
                    onChange={(e) => {
                      setSignInData({
                        ...signInData,
                        emailOrUser: e.target.value,
                      });
                      if (signInErrors.emailOrUser)
                        setSignInErrors({ ...signInErrors, emailOrUser: "" });
                    }}
                    placeholder="you@domain.com"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-all outline-none bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 ${
                      signInErrors.emailOrUser
                        ? "border-rose-500 focus:ring-2 focus:ring-rose-500/30"
                        : "border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
                    }`}
                  />
                </div>
                {signInErrors.emailOrUser && (
                  <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />{" "}
                    {signInErrors.emailOrUser}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(true)}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-medium focus:outline-none hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type={showSignInPass ? "text" : "password"}
                    value={signInData.password}
                    onChange={(e) => {
                      setSignInData({
                        ...signInData,
                        password: e.target.value,
                      });
                      if (signInErrors.password)
                        setSignInErrors({ ...signInErrors, password: "" });
                    }}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm transition-all outline-none bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 ${
                      signInErrors.password
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
                {signInErrors.password && (
                  <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />{" "}
                    {signInErrors.password}
                  </p>
                )}
              </div>

              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={signInData.rememberMe}
                    onChange={(e) =>
                      setSignInData({
                        ...signInData,
                        rememberMe: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-white dark:bg-slate-800 cursor-pointer"
                  />
                  <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    Remember this device for 30 days
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSigningIn}
                className="w-full py-3 px-4 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                {isSigningIn ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Sign Up Form */}
          {tab === "signup" && (
            <form
              onSubmit={handleSignUpSubmit}
              className="space-y-3.5"
              noValidate
            >
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={signUpData.name}
                    onChange={(e) => {
                      setSignUpData({ ...signUpData, name: e.target.value });
                      if (signUpErrors.name)
                        setSignUpErrors({ ...signUpErrors, name: "" });
                    }}
                    placeholder="Alex Morgan"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-all outline-none bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 ${
                      signUpErrors.name
                        ? "border-rose-500 focus:ring-2 focus:ring-rose-500/30"
                        : "border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
                    }`}
                  />
                </div>
                {signUpErrors.name && (
                  <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {signUpErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="email"
                    value={signUpData.email}
                    onChange={(e) => {
                      setSignUpData({ ...signUpData, email: e.target.value });
                      if (signUpErrors.email)
                        setSignUpErrors({ ...signUpErrors, email: "" });
                    }}
                    placeholder="alex@company.com"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-all outline-none bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 ${
                      signUpErrors.email
                        ? "border-rose-500 focus:ring-2 focus:ring-rose-500/30"
                        : "border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
                    }`}
                  />
                </div>
                {signUpErrors.email && (
                  <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {signUpErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type={showSignUpPass ? "text" : "password"}
                    value={signUpData.password}
                    onChange={(e) => {
                      setSignUpData({
                        ...signUpData,
                        password: e.target.value,
                      });
                      if (signUpErrors.password)
                        setSignUpErrors({ ...signUpErrors, password: "" });
                    }}
                    placeholder="Min. 8 characters"
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm transition-all outline-none bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 ${
                      signUpErrors.password
                        ? "border-rose-500 focus:ring-2 focus:ring-rose-500/30"
                        : "border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignUpPass(!showSignUpPass)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showSignUpPass ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Password Strength Meter */}
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-500 dark:text-slate-400">
                      Password strength:
                    </span>
                    <span
                      className={`font-semibold ${passwordStrength.textColor}`}
                    >
                      {passwordStrength.text}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`h-full transition-colors duration-200 ${
                          passwordStrength.score >= step
                            ? passwordStrength.color
                            : "bg-slate-200 dark:bg-slate-700"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                {signUpErrors.password && (
                  <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />{" "}
                    {signUpErrors.password}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type={showSignUpConfirmPass ? "text" : "password"}
                    value={signUpData.confirmPassword}
                    onChange={(e) => {
                      setSignUpData({
                        ...signUpData,
                        confirmPassword: e.target.value,
                      });
                      if (signUpErrors.confirmPassword)
                        setSignUpErrors({
                          ...signUpErrors,
                          confirmPassword: "",
                        });
                    }}
                    placeholder="Repeat your password"
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm transition-all outline-none bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 ${
                      signUpErrors.confirmPassword
                        ? "border-rose-500 focus:ring-2 focus:ring-rose-500/30"
                        : "border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowSignUpConfirmPass(!showSignUpConfirmPass)
                    }
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showSignUpConfirmPass ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {signUpErrors.confirmPassword && (
                  <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />{" "}
                    {signUpErrors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={signUpData.terms}
                    onChange={(e) => {
                      setSignUpData({ ...signUpData, terms: e.target.checked });
                      if (signUpErrors.terms)
                        setSignUpErrors({ ...signUpErrors, terms: "" });
                    }}
                    className="w-4 h-4 mt-0.5 rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-white dark:bg-slate-800 cursor-pointer"
                  />
                  <span className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
                    I agree to the{" "}
                    <a
                      href="#terms"
                      onClick={(e) => {
                        e.preventDefault();
                        addToast("Terms of Service reviewed.", "info");
                      }}
                      className="text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="#privacy"
                      onClick={(e) => {
                        e.preventDefault();
                        addToast("Privacy Policy reviewed.", "info");
                      }}
                      className="text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      Privacy Policy
                    </a>
                    .
                  </span>
                </label>
                {signUpErrors.terms && (
                  <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {signUpErrors.terms}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSigningUp}
                className="w-full py-3 px-4 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 group cursor-pointer mt-2"
              >
                {isSigningUp ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Bottom helper switcher */}
          <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            {tab === "signin"
              ? "Don't have an account?"
              : "Already have an account?"}
            <button
              type="button"
              onClick={() => {
                setTab(tab === "signin" ? "signup" : "signin");
                setSignInErrors({});
                setSignUpErrors({});
              }}
              className="ml-1 text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              {tab === "signin" ? "Sign up now" : "Sign in instead"}
            </button>
          </div>
        </div>

        {/* Security endorsement */}
        <div className="flex items-center justify-center gap-2 mt-6 text-slate-400 dark:text-slate-500 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>256-Bit End-to-End SSL Encryption</span>
        </div>
      </main>
    </div>
  );
}

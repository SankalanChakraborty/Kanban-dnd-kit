import { useState, useEffect } from "react";
import Button from "./shared/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { resendVerifyMail } from "../api/user";

const VerifyEmailModal = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email: string | undefined =
    location.state?.email ??
    sessionStorage.getItem("pendingVerificationEmail") ??
    undefined;

  // Someone opened /email-verify directly with no email → send them back
  useEffect(() => {
    if (!email) navigate("/login", { replace: true });
  }, [email, navigate]);

  const [timer, setTimer] = useState(42);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (timer === 0) return;

    const timeoutId = setTimeout(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [timer]);

  const resendEmailHandler = async () => {
    if (timer > 0 || !email || isResending) return;

    setIsResending(true);
    try {
      const data = await resendVerifyMail(email as string);
      console.log("Data from resend email>>>>", data);

      if (data?.code === "ALREADY_VERIFIED") {
        navigate("/login");
        return;
      }

      if (data?.code === "COOLDOWN_ACTIVE") {
        setTimer(data.retryAfter);
      }

      if (data?.status === "success") {
        setTimer(42);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-baseline p-4 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-200 bg-[linear-gradient(135deg,#020617_0%,#0f172a_55%,#1e293b_100%)]">
      <div className="flex flex-col max-w-sm justify-center items-center p-4 bg-[#111a2e] border border-slate-700/70 rounded-xl shadow-lg backdrop-blur-sm">
        <div className="flex flex-col justify-center items-center gap-2">
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
          <h3 className="text-md font-bold text-slate-900 dark:text-white">
            Check your inbox
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-1">
            We sent a verification link to{" "}
            <b className="text-slate-300">{email}</b>
          </p>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 my-2">
          Open the link to activate your account. It expires in 24 hours.
        </p>
        <div className="flex flex-col justify-center items-center w-full gap-2">
          {/* {timer ? (
            <Button
              buttonStyle={"disabled"}
              type={"button"}
              disabled={timer > 0}
              additionalStyles={"w-full"}
            >
              {`Resend Email in ${timer}s`}
            </Button>
          ) : (
            <Button
              buttonStyle={"primary"}
              type={"submit"}
              disabled={timer < 0}
              onClick={resendEmailHandler}
              additionalStyles={"w-full"}
            >
              Resend Email
            </Button>
          )} */}
          <Button
            buttonStyle={timer > 0 || isResending ? "disabled" : "primary"}
            type="button"
            disabled={timer > 0 || isResending}
            onClick={resendEmailHandler}
            additionalStyles="w-full"
          >
            {isResending
              ? "Sending..."
              : timer > 0
                ? `Resend Email in ${timer}s`
                : "Resend Email"}
          </Button>
          <a
            className="text-sm text-[#818CF8] hover:font-semibold transition-all"
            href="/login"
          >
            Use a different email
          </a>
          <a
            className="text-sm text-[#818CF8] hover:font-semibold transition-all"
            href="#"
          >
            Sign out
          </a>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailModal;

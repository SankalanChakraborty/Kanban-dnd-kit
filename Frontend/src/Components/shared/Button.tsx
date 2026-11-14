type ButtonType = "primary" | "secondary" | "tertiary";

interface ButtonProps {
  buttonType: ButtonType;
  buttonLabel: string;
  disabled?: boolean;
  isLoading?: boolean;
  buttonTertiary?: boolean;
  additionalStyles?: string;
}

const Button = ({
  buttonType = "primary",
  buttonLabel,
  disabled = false,
  additionalStyles = "",
}: ButtonProps) => {
  return (
    <div>
      {buttonType === "primary" ? (
        <button
          type="button"
          disabled={disabled}
          className={`px-5 py-2.5 w-fit rounded-xl text-sm font-semibold text-white border-0 bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer ${additionalStyles ? additionalStyles : ""}`}
        >
          {buttonLabel}
        </button>
      ) : buttonType === "secondary" ? (
        <button
          type="button"
          disabled={disabled}
          className={`px-4 py-2.5 w-fit rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-700/70 cursor-pointer transition-colors ${additionalStyles ? additionalStyles : ""}`}
        >
          {buttonLabel}
        </button>
      ) : (
        <button
          type="button"
          disabled={disabled}
          className={`px-4 py-2.5 w-fit rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors ${additionalStyles ? additionalStyles : ""}`}
        >
          {buttonLabel}
        </button>
      )}
    </div>
  );
};

export default Button;

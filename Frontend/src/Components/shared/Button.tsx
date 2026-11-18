type ButtonStyle = "primary" | "secondary" | "tertiary" | "disabled";

type ButtonType = "submit" | "button";

interface ButtonProps {
  buttonStyle: ButtonStyle;
  children: React.ReactNode;
  disabled?: boolean;
  isLoading?: boolean;
  buttonTertiary?: boolean;
  additionalStyles?: string;
  type: ButtonType;
  onClick?: () => void;
}

const Button = ({
  buttonStyle = "primary",
  children,
  disabled = false,
  additionalStyles = "",
  type = "button",
  onClick,
}: ButtonProps) => {
  return (
    <div className="w-full">
      {buttonStyle === "primary" ? (
        <button
          type={type}
          disabled={disabled}
          onClick={onClick}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold text-white border-0 bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all flex justify-center items-center gap-2 cursor-pointer ${additionalStyles ? additionalStyles : ""}`}
        >
          {children}
        </button>
      ) : buttonStyle === "secondary" ? (
        <button
          type={type}
          disabled={disabled}
          onClick={onClick}
          className={`px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 flex justify-center items-center dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-700/70 cursor-pointer transition-colors ${additionalStyles ? additionalStyles : ""}`}
        >
          {children}
        </button>
      ) : buttonStyle === "disabled" ? (
        <button
          type={type}
          disabled={disabled}
          onClick={onClick}
          className={`px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-600 ${additionalStyles ? additionalStyles : ""}`}
        >
          {children}
        </button>
      ) : (
        <button
          type={type}
          disabled={disabled}
          onClick={onClick}
          className={`px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors ${additionalStyles ? additionalStyles : ""}`}
        >
          {children}
        </button>
      )}
    </div>
  );
};

export default Button;

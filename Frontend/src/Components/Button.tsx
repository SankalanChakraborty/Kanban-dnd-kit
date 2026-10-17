import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  buttonType: "submit" | "reset" | "button";
}

const Button = ({ children, buttonType }: ButtonProps) => {
  return (
    <button
      className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold tracking-wide shadow-md shadow-indigo-600/20 active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
      type={buttonType}
      data-testid="add-task"
    >
      {children}
    </button>
  );
};

export default Button;

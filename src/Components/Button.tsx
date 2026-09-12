import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  buttonType: "submit" | "reset" | "button";
}

const Button = ({ children, buttonType }: ButtonProps) => {
  return (
    <button
      className="py-2 px-4 w-fit bg-blue-600 rounded-lg text-white font-semibold hover:bg-blue-700 transition-colors duration-200 cursor-pointer shadow-sm"
      type={buttonType}
    >
      {children}
    </button>
  );
};

export default Button;

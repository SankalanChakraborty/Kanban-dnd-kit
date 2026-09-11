import React from "react";

interface ButtonProps {
  children: React.ReactNode;
}

const Button = ({ children }: ButtonProps) => {
  return (
    <button className="py-2 px-4 w-fit bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg text-white hover:from-emerald-700 hover:to-green-700 cursor-pointer">
      {children}
    </button>
  );
};

export default Button;

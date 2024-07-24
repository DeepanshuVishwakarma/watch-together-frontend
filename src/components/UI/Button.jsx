import * as React from "react";
import { twMerge } from "tailwind-merge";

const Button = React.forwardRef(({ className, ...props }, ref) => {
  const defaultDesign = "px-2 py-1 bg-red-500 hover:bg-red-700 text-white";
  return (
    <button
      className={twMerge(defaultDesign, className)}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = "Button";

export default Button;

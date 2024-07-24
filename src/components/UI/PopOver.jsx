import React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

export const Popover = PopoverPrimitive.Root;

export const PopoverTrigger = ({ children }) => {
  return (
    <PopoverPrimitive.Trigger asChild>{children}</PopoverPrimitive.Trigger>
  );
};

export const PopoverContent = React.forwardRef(
  ({ children, ...props }, forwardedRef) => (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content sideOffset={5} {...props} ref={forwardedRef}>
        {children}
        <PopoverPrimitive.Arrow />
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  )
);

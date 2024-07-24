import * as React from "react";

const Input = React.forwardRef(
  (
    {
      className,
      type,
      value,
      onChange,
      icon,
      onIconClick,
      iconClassName,
      ...props
    },
    ref
  ) => {
    return (
      <div className="relative flex h-full">
        <input
          type={type}
          className={
            "flex h-9 w-full border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          }
          value={value || ""}
          onChange={onChange}
          ref={ref}
          {...props}
        />
        {icon && (
          <div onClick={onIconClick} className={"h-100 w-15"}>
            {icon}{" "}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };

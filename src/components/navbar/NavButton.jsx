import Button from "../UI/Button";

import React from "react";

const NavButton = React.forwardRef(({ className, ...props }, ref) => {
  return <Button className={className} ref={ref} {...props} />;
});
NavButton.displayName = "NavButton";
export default NavButton;

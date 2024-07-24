import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Popover, PopoverContent, PopoverTrigger } from "../../UI/PopOver";
import Button from "../../UI/Button";

export default function RoomUsersPopover({ trigger, children }) {
  return (
    <Popover className="relative">
      <PopoverTrigger className="h-full">{trigger}</PopoverTrigger>
      <PopoverContent className="p-4">{children}</PopoverContent>
    </Popover>
  );
}

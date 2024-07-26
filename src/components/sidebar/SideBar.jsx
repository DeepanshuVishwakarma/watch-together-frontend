import React from "react";
import styled from "styled-components";
import Button from "../UI/Button";
import { Link } from "react-router-dom";
const SideBarButton = styled(Button)`
  &.sidebarbutton {
    // some style
    padding: 10px;
    margin: 5px;
    border: 1px solid #ccc;
    background-color: #f0f0f0;
    &:hover {
      background-color: #e0e0e0;
    }
  }
`;
SideBarButton.displayName = "SideBarButton";

export default function SideBar() {
  // function handleVideos() {
  //   // console.log("Handling videos");
  // }

  // function handleRooms() {
  //   // console.log("Handling rooms");
  // }

  return (
    <div>
      <Link to="videos">
        <SideBarButton className="sidebarbutton">Videos</SideBarButton>
      </Link>
      <Link to="rooms">
        <SideBarButton className="sidebarbutton">Rooms</SideBarButton>
      </Link>
    </div>
  );
}

SideBar.displayName = "Sidebar";

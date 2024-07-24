import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import NavButton from "./NavButton";

function Navbar() {
  const { token } = useSelector((state) => state.authUser);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Create refs for buttons
  const homeRef = useRef(null);
  const loginRef = useRef(null);
  const signupRef = useRef(null);
  const profileRef = useRef(null);

  const buttons = [
    {
      key: "home",
      onClick: () => navigate("/"),
      onHover: "hover:shadow-lg",
      ref: homeRef,
      text: "HOME",
      renderCondition: true,
      props: {
        className:
          "rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100",
      },
    },
    {
      key: "login",
      onClick: () => navigate("/login"),
      onHover: "hover:shadow-lg",
      ref: loginRef,
      text: "LOGIN",
      renderCondition: token === null,
      props: {
        className:
          "rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100",
      },
    },
    {
      key: "signup",
      onClick: () => navigate("/signup"),
      onHover: "hover:shadow-lg",
      ref: signupRef,
      text: "SIGN UP",
      renderCondition: token === null,
      props: {
        className:
          "rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100",
      },
    },
    {
      key: "profile",
      onClick: () => navigate("/profile"),
      onHover: "hover:shadow-lg",
      ref: profileRef,
      text: "Profile",
      renderCondition: token !== null,
      props: {},
    },
  ];

  useEffect(() => {
    // Example condition to focus on the login button
    if (token === null && loginRef.current) {
      loginRef.current.focus();
    }
  }, [token]);

  return (
    <div
      className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 transition-all duration-200`}
    >
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <div>w2G</div>
        </Link>

        {/* Buttons */}
        <div className="hidden items-center gap-x-4 md:flex">
          {buttons.map(
            (button) =>
              button.renderCondition && (
                <NavButton
                  key={button.key}
                  ref={button.ref}
                  onClick={button.onClick}
                  {...button.props}
                  className={`${button.props.className} ${button.onHover}`}
                >
                  {button.text}
                </NavButton>
              )
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;

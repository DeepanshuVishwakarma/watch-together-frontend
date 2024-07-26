import { setIsTokenLoading, setToken } from "../../store/reducers/authSlice";
import axios from "../../hooks/axios";
import { apiConnector } from "../apiConnector";
import {
  setIsSignedIn,
  setUser,
  setIsUserLoading,
  setError,
} from "../../store/reducers/user";
import { endpoints } from "../apis";

const { LOGIN_API } = endpoints;

export function login(email, password, navigate) {
  return async (dispatch) => {
    dispatch(setIsUserLoading(true));
    try {
      // console.log("login: loading...");
      if (!LOGIN_API) {
        throw new Error("Login API/url is not available");
      }
      const response = await axios(LOGIN_API, {
        method: "POST",
        data: {
          email,
          password,
        },
      });

      // console.log("LOGIN API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      // console.log("data ", response.data);
      // console.log("login, SUCCESSFUL");

      dispatch(setToken(response.data.token));
      dispatch(setUser(response.data.user));
      dispatch(setIsSignedIn(true));

      navigate("/");
    } catch (error) {
      dispatch(setError(true));
      // console.error("LOGIN API ERROR............", error);
    }
    dispatch(setIsUserLoading(false));
  };
}

export function tokenBasedLogin(token) {
  return async function (dispatch) {
    dispatch(setIsUserLoading(true));
    try {
      const TOKEN_LOGIN_API = "/auth/is-auth";
      // console.log("token based login : loading...");

      const response = await axios(TOKEN_LOGIN_API, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // console.log("token based login successful............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      // console.log(" login , SUCCESSFUL");

      // const userImage = response.data?.user?.image
      //   ? response.data.user.image
      //   : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`
      dispatch(setUser({ ...response.data.user }));

      navigate("/");
    } catch (error) {
      console.error("TOKEN LOGIN API ERROR............", error);
      // console.error("Token Login Failed");
    }
    dispatch(setIsUserLoading(false));
  };
}

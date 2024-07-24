import { useState } from "react";
import axios from "./axios";
import { BASE_URL } from "../service/apis";
export default function useHttp() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const sendRequest = async ({
    url,
    method,
    body = null,
    headers = {},
    rawHeader = null,
  }) => {
    setIsLoading(true);
    try {
      console.log("body inside useHttp", body);

      const response = await axios({
        url,
        method,
        data: body,
        headers: rawHeader || {
          "Content-Type": "application/json",
          ...headers,
        },
      });
      if (response.status >= 200 && response.status < 300) {
        setData(response.data);
      }
    } catch (err) {
      // console.error(err?.response?.data);
      console.log(err);
      setError(
        err?.response?.data?.message || err?.message || "Something went wrong"
      );
    }
    setIsLoading(false);
  };

  return { isLoading, error, data, sendRequest, setError, setData };
}

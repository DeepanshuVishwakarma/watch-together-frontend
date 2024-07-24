import axios from "axios";

const instance = axios.create({
  baseURL: "http://api/v1/",
});

export default instance;

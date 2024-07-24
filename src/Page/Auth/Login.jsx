import React, { useEffect, useState } from "react";
import useHttp from "../../hooks/useHttp";
import { Input } from "../../components/UI/Input";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../service/operations/authApi";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const { isLoading, error, data, sendRequest } = useHttp();
  const { email, password } = formData;

  const {
    user,
    isLoading: isUserLoading,
    error: userError,
    isSignedIn: isUserSignedIn,
  } = useSelector((state) => state.User);

  const { token } = useSelector((state) => state.authUser);

  // just for making sure that user has been logged in
  useEffect(() => {
    console.log(token, user, isUserLoading, error, isUserSignedIn);
  }, [isUserSignedIn]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) return;
    dispatch(login(email, password, navigate));
  };

  return (
    <div>
      <h2>Login</h2>
      <div>
        <div>
          <label>Email</label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p>{errors.email}</p>}
        </div>
        <div>
          <label>Password</label>
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p>{errors.password}</p>}
        </div>
        <button onClick={() => onSubmit()} disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
        {error && <p>{error}</p>}
      </div>
      {data && <p>Login successful!</p>}
    </div>
  );
};

export default Login;

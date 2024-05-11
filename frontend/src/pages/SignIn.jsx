import axios from "axios";
import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import { useDispatch, useSelector } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/user/userSlice";
import SignInWithGoogle from "../components/SignInWithGoogle";

const SignIn = () => {
  const [formData, setFormData] = useState({});
  // const [loading, setLoading] = useState(false);
  // const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, loading } = useSelector((state) => state.user);

  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      dispatch(signInStart());
      const res = await axios.post("/api/auth/sign-in", formData);
      if (res.data.statusCode === 200) {
        dispatch(signInSuccess(res.data.data.user));
        navigate("/");
        console.log(res.data.data);
      }
      console.log(res.data);
    } catch (error) {
      dispatch(signInFailure(error.response.data.message));
      // setErrorMessage(error.response.data.message);
      console.log(error);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Sign In</h1>
      <form className="flex flex-col gap-4" onSubmit={submitHandler}>
        <input
          type="text"
          id="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          onChange={handleOnChange}
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          onChange={handleOnChange}
        />
        <button
          disabled={loading}
          type="submit"
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:placeholder-opacity-80"
        >
          {loading ? "Loading..." : "sign In"}
        </button>
        {/* <OAuth /> */}
        <SignInWithGoogle />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Don't have an account</p>
        <Link to="/sign-up">
          <span className="text-blue-700">Sign up</span>
        </Link>
      </div>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default SignIn;

import React from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/user/userSlice";

const OAuth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, loading } = useSelector((state) => state.user);

  const handleAuthClick = async () => {
    try {
      dispatch(signInStart());
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const result = await signInWithPopup(auth, provider);
      const fullName = result.user.displayName.split(" ");
      const userData = {
        email: result.user.email,
        firstName: fullName[0],
        lastName: fullName[1],
        avatar: result.user.photoURL,
      };
      const res = await axios.post("/api/auth/register-with-google", userData);
      console.log(res.data);
      if (res.data.statusCode === 201) {
        dispatch(signInSuccess(res.data.data.user));
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      dispatch(signInFailure(error.response.data.message));
    }
  };
  return (
    <>
      <button
        type="button"
        onClick={handleAuthClick}
        className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
      >
        {loading ? "Loading..." : "continue with google"}
      </button>
      {/* {error && <p className="text-red-500 mt-5">{error} </p>} */}
    </>
  );
};

export default OAuth;

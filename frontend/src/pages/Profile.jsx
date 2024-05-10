import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { async } from "@firebase/util";
import axios from "axios";
import { current } from "@reduxjs/toolkit";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteStart,
  deleteSuccess,
  deleteFailure,
} from "../redux/user/userSlice";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const fileRef = useRef();
  const [file, setFile] = useState(undefined);
  const [filePrec, setFilePrec] = useState(0);
  const [fileUploaderr, setFileUploaderr] = useState(false);
  const [formData, setFormData] = useState({
    avatar: undefined,
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    email: currentUser.email,
    username: currentUser.username,
    password: undefined,
  });
  const { error, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    // create file name to upload
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);

    // get persentage of uploading file
    const uplloadTask = uploadBytesResumable(storageRef, file);

    // track the changes
    uplloadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePrec(Math.round(progress));
        console.log(progress, "%");
      },
      (error) => {
        setFileUploaderr(true);
      },
      () => {
        getDownloadURL(uplloadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateStart());
      const res = await axios.patch(
        `/api/users/profile/${currentUser._id}`,
        formData
      );
      if (res.data.statusCode === 200) {
        dispatch(updateSuccess(res.data.data.user));
      }
      console.log(res.data);
    } catch (error) {
      dispatch(updateFailure(error.response.data.message));
      console.log(error);
    }
  };

  // delete account handlers
  const deleteAccountHandler = async () => {
    try {
      const res = await axios.delete(`/api/users/profile/${currentUser._id}`);
      if (res.data.statusCode === 200) {
        dispatch(deleteSuccess());
        console.log(res.data);
        navigate("/sign-in");
      }
    } catch (error) {
      dispatch(deleteFailure(error.response.data.message));
      console.log(error);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-center text-3xl font-semibold my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          id=""
          ref={fileRef}
          accept="image/*"
          hidden
          onChange={(e) => {
            setFile(e.target.files[0]);
          }}
        />
        <img
          onClick={() => {
            fileRef.current.click();
          }}
          src={formData.avatar || currentUser.avatar}
          alt=""
          className="rounded-full w-24 h-24 mt-2 object-cover self-center cursor-pointer"
        />
        <p className="text-sm self-center">
          {fileUploaderr ? (
            <span className="text-red-700">Error while uploading file</span>
          ) : filePrec > 0 && filePrec < 100 ? (
            <span className="text-slate-700 text-center">
              {`uploading ${filePrec}%`}
            </span>
          ) : filePrec === 100 ? (
            <span className="text-green-700 text-center">
              File uploaded successfully
            </span>
          ) : (
            ""
          )}
        </p>
        <div className="flex justify-between items-center gap-3 w-full">
          <input
            type="text"
            id="firstName"
            placeholder="First Name"
            className="border p-3 rounded-lg w-[48%]"
            value={formData.firstName}
            onChange={handleOnChange}
          />
          <input
            type="text"
            id="lastName"
            placeholder="Last Name"
            className="border p-3 rounded-lg w-[48%]"
            value={formData.lastName}
            onChange={handleOnChange}
          />
        </div>
        <input
          type="text"
          id="username"
          placeholder="username"
          className="border p-3 rounded-lg"
          value={formData.username}
          onChange={handleOnChange}
        />
        <input
          type="text"
          id="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          value={formData.email}
          onChange={handleOnChange}
        />
        <input
          type="password"
          id="password"
          placeholder="*******"
          className="border p-3 rounded-lg"
          value={formData.password}
          onChange={handleOnChange}
        />
        <button
          // disabled={loading}
          type="submit"
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:placeholder-opacity-80"
        >
          {loading ? "Loading..." : "update"}
        </button>
        <Link
          to="/create-listing"
          className="uppercase text-center text-white rounded-lg bg-green-700 p-3 hover:opacity-95"
        >
          create listing
        </Link>
      </form>

      {error && <p className="text-red-700 mt-3"> {error}</p>}
      <div className="flex justify-between mt-3">
        <span
          className="text-red-700 uppercase cursor-pointer"
          onClick={deleteAccountHandler}
        >
          delete Account
        </span>
        <span className="text-red-700 uppercase cursor-pointer">Sign out</span>
      </div>
    </div>
  );
};

export default Profile;

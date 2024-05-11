import React, { useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    const urlsParms = new URLSearchParams(window.location.search);
    urlsParms.set("searchTerm", searchTerm);
    const serachQuery = urlsParms.toString();
    navigate(`serach?${serachQuery}`);
  };

  useEffect(() => {
    const urlsParms = new URLSearchParams(location.search);
    const searchTermUrl = urlsParms.get("searchTerm");
    if (searchTermUrl) {
      setSearchTerm(searchTermUrl);
    }
  }, [location.search]);

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center mx-auto max-w-6xl p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Arvind</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>
        <form
          onSubmit={submitHandler}
          className="bg-slate-100 rounded-lg p-3 flex items-center"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
          <button>
            <FaSearch className="text-slate-600 " />
          </button>
        </form>
        <ul className="flex gap-4">
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              Home
            </li>
          </Link>
          <Link to="/create-listing">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              Create Listing
            </li>
          </Link>
          {currentUser && (
            <Link to="/my-listing">
              <li className="hidden sm:inline text-slate-700 hover:underline">
                My Listing
              </li>
            </Link>
          )}

          {currentUser ? (
            <Link to="/profile">
              <img
                src={
                  currentUser.avatar ||
                  "https://static-00.iconduck.com/assets.00/user-icon-2048x2048-ihoxz4vq.png"
                }
                alt=""
                className="rounded-full w-7 h-7 "
              />
            </Link>
          ) : (
            <Link to="/sign-in">
              <li className="hidden sm:inline text-slate-700 hover:underline">
                Sign in
              </li>
            </Link>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Header;

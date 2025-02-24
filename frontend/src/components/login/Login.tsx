import React from "react";
import { FaArrowRightLong, FaLeaf } from "react-icons/fa6";
import { IoPersonOutline } from "react-icons/io5";
import { RiLockPasswordFill } from "react-icons/ri";

const Login = () => {
  return (
    <div>
      <form
        action=""
        className="flex flex-col space-y-3 shadow-lg pb-10 pt-10 rounded-lg mx-10 my-10 px-10"
      >
        <div className="flex flex-col items-center space-y-2">
          <FaLeaf className="size-10 text-green-800" />
          <p className="text-2xl font-bold text-gray-700">Welcome Back</p>
          <p className="text-gray-700">
            Sign in into your biodiversity account
          </p>
        </div>

        <label htmlFor="username">username</label>
        <div className="relative flex flex-row items-center">
          <IoPersonOutline className="absolute left-2 text-gray-500" />
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Enter your username"
            className="border border-gray-300 px-7 rounded-md py-1 text-gray-900 left-2 w-full"
          />
        </div>
        <label htmlFor="password">Password</label>
        <div className="relative flex flex-row items-center">
          <RiLockPasswordFill className="absolute left-2 text-gray-500" />
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter your password"
            className="border border-gray-300 px-7 rounded-md py-1 text-gray-900 left-2 w-full"
          />
        </div>
        <div className="flex justify-between items-center">
          <label htmlFor="remember" className="text-gray-700 flex gap-2">
            <input type="checkbox" name="remember" id="remember" className="" />
            Remember me
          </label>
          <a href="" className="text-green-700 text-end pointer-cursor">
            Forgot password?
          </a>
        </div>
        <button className="flex gap-2 bg-green-700 text-white px-4 py-2 rounded-md items-center w-full justify-center cursor-pointer">
          Login
          <FaArrowRightLong />
        </button>
        <p className="text-gray-700">
          Don't have an account?{" "}
          <a href="" className="text-green-700">
            Sign up
          </a>
        </p>
        <hr className="text-gray-100 mt-2" />
      </form>
    </div>
  );
};

export default Login;

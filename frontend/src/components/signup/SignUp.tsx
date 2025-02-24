import { FaArrowRightLong } from "react-icons/fa6";
import { IoPersonOutline } from "react-icons/io5";
import { RiLockPasswordFill } from "react-icons/ri";

const SignUp = () => {
  return (
    <div>
      <form
        action=""
        className="flex flex-col space-y-3 shadow-lg pb-10 pt-10 rounded-lg mx-10 my-10 px-10"
      >
        <div className="flex flex-col items-left space-y-2">
          <p className="text-2xl font-bold text-gray-700">
            Create Your Account
          </p>
          <p className="text-gray-700">Fill in your details to get started</p>
        </div>

        <div className="flex flex-row space-x-4">
          <label htmlFor="username" className="text-gray-700">
            Username
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Choose a username"
              className="border border-gray-300 px-7 rounded-md py-1 text-gray-900 left-2 w-full"
            />
          </label>

          <label htmlFor="fullname" className="text-gray-700">
            Full Name
            <input
              type="text"
              name="fullname"
              id="fullname"
              placeholder="Enter your full name"
              className="border border-gray-300 px-7 rounded-md py-1 text-gray-900 left-2 w-full"
            />
          </label>
        </div>

        <label htmlFor="email" className="text-gray-700">
          Email Address
          <input
            type="email"
            name="email  "
            id="email"
            placeholder="Enter your email"
            className="border border-gray-300 px-7 rounded-md py-1 text-gray-900 left-2 w-full"
          />
        </label>

        <label htmlFor="password">
          Password
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Create a strong password"
            className="border border-gray-300 px-7 rounded-md py-1 text-gray-900 left-2 w-full"
          />
        </label>

        <div className="flex flex-row space-x-4">
          <label htmlFor="location" className="text-gray-700">
            location
            <input
              type="text"
              name="location  "
              id="location"
              placeholder="Your location"
              className="border border-gray-300 px-7 rounded-md py-1 text-gray-900 left-2 w-full"
            />
          </label>

          <label htmlFor="organization" className="text-gray-700">
            Organization
            <input
              type="text"
              name="organization  "
              id="organization"
              placeholder="Your organization"
              className="border border-gray-300 px-7 rounded-md py-1 text-gray-900 left-2 w-full"
            />
          </label>
        </div>

        <label htmlFor="expertise" className="text-gray-700">
          Area of expertise
          <input
            type="expertise"
            name="expertise  "
            id="expertise"
            placeholder="Enter your expertise"
            className="border border-gray-300 px-7 rounded-md py-1 text-gray-900 left-2 w-full"
          />
        </label>

        <label htmlFor="remember" className="text-gray-700 flex gap-2">
          <input type="checkbox" name="remember" id="remember" className="" />I
          agree to the{" "}
          <a href="" className="text-green-700 text-end pointer-cursor">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="" className="text-green-700 text-end pointer-cursor">
            Privacy Policy
          </a>
        </label>

        <button className="flex gap-2 bg-green-700 text-white px-4 py-2 rounded-md items-center w-full justify-center cursor-pointer">
          Create Account
        </button>
        <p className="text-gray-700 inline-block mx-auto">
          Already have an account?{" "}
          <a href="" className="text-green-700">
            Login
          </a>
        </p>
        <hr className="text-gray-100 mt-2" />
      </form>
    </div>
  );
};

export default SignUp;

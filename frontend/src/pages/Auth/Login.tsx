import { useState, useEffect } from "react";
import {
  Link,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { FaArrowRightLong, FaLeaf } from "react-icons/fa6";
import { IoPersonOutline } from "react-icons/io5";
import { RiLockPasswordFill } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../../store/AuthContext";
import { initiateGoogleLogin } from "../../services/authService";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { login, error, clearError } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Get the intended destination from the location state, or default to homepage
  const from = (location.state as any)?.from?.pathname || "/";

  // checking for error message in URL (from Google Auth)
  useEffect(() => {
    const errorMsg = searchParams.get("error");
    if (errorMsg) {
      setFormError(decodeURIComponent(errorMsg));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    clearError();
    setFormError(null);

    // Form validation
    if (!username.trim()) {
      setFormError("Username is required");
      return;
    }

    if (!password) {
      setFormError("Password is required");
      return;
    }

    setIsSubmitting(true);

    try {
      await login(username, password);
      // Navigate to the page the user was trying to access, or home
      navigate(from, { replace: true });
    } catch (err: any) {
      setFormError(err.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    initiateGoogleLogin();
  };

  return (
    <div className="max-w-md mx-auto">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col space-y-5 shadow-lg p-10 rounded-lg bg-white"
      >
        <div className="flex flex-col items-center space-y-3 mb-4">
          <FaLeaf className="text-green-700 text-4xl" />
          <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-gray-600 text-center">
            Sign in to your WildPedia account
          </p>
        </div>

        {/* Error Message */}
        {(formError || error) && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {formError || error}
          </div>
        )}

        {/* Username Field */}
        <div className="space-y-2">
          <label htmlFor="username" className="text-gray-700 font-medium">
            Username
          </label>
          <div className="relative flex items-center">
            <IoPersonOutline className="absolute left-3 text-gray-500" />
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="border border-gray-300 pl-10 pr-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label htmlFor="password" className="text-gray-700 font-medium">
            Password
          </label>
          <div className="relative flex items-center">
            <RiLockPasswordFill className="absolute left-3 text-gray-500" />
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="border border-gray-300 pl-10 pr-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex justify-between items-center">
          <label
            htmlFor="remember"
            className="flex items-center space-x-2 text-gray-700"
          >
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded cursor-pointer text-green-600 focus:ring-green-500"
            />
            <span>Remember me</span>
          </label>
          <a href="#" className="text-green-700 hover:text-green-800">
            Forgot password?
          </a>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex justify-center cursor-pointer items-center space-x-2 bg-green-700 text-white py-2 px-4 rounded-md hover:bg-green-800 transition-colors disabled:bg-gray-400"
        >
          {isSubmitting ? (
            <span>Logging in...</span>
          ) : (
            <>
              <span>Login</span>
              <FaArrowRightLong />
            </>
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-3 text-gray-500 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Google Login Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex cursor-pointer justify-center items-center space-x-2 bg-white text-gray-700 border border-gray-300 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
        >
          <FcGoogle className="text-xl" />
          <span>Continue with Google</span>
        </button>

        {/* Sign Up Link */}
        <p className="text-center text-gray-700">
          Don't have an account?{" "}
          <Link to="/signup" className="text-green-700 hover:text-green-800">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;

// src/pages/Auth/SignUp.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";
import { useAuth } from "../../store/AuthContext";

const SignUp = () => {
  const navigate = useNavigate();
  const { register, error, clearError } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: "",
    organization: "",
    expertiseArea: "",
    agreeToTerms: false,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear field error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.username.trim()) {
      errors.username = "Username is required";
    } else if (formData.username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (!formData.agreeToTerms) {
      errors.agreeToTerms = "You must agree to the terms and privacy policy";
    }

    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    clearError();

    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName || undefined,
        location: formData.location || undefined,
        organization: formData.organization || undefined,
        expertiseArea: formData.expertiseArea || undefined,
      });

      // Redirect to home page after successful registration
      navigate("/");
    } catch (err: any) {
      // API errors should be handled by the auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-8 mb-10"
      >
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Create Your Account
          </h1>
          <p className="text-gray-600">Fill in your details to get started</p>
        </div>

        {/* API Error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label
              htmlFor="username"
              className="block text-gray-700 font-medium mb-2"
            >
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              className={`border ${
                formErrors.username ? "border-red-500" : "border-gray-300"
              } rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500`}
            />
            {formErrors.username && (
              <p className="text-red-500 text-sm mt-1">{formErrors.username}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="fullName"
              className="block text-gray-700 font-medium mb-2"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Email */}
        <div className="mb-6">
          <label
            htmlFor="email"
            className="block text-gray-700 font-medium mb-2"
          >
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className={`border ${
              formErrors.email ? "border-red-500" : "border-gray-300"
            } rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500`}
          />
          {formErrors.email && (
            <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-2"
            >
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              className={`border ${
                formErrors.password ? "border-red-500" : "border-gray-300"
              } rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500`}
            />
            {formErrors.password && (
              <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-gray-700 font-medium mb-2"
            >
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className={`border ${
                formErrors.confirmPassword
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500`}
            />
            {formErrors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {formErrors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label
              htmlFor="location"
              className="block text-gray-700 font-medium mb-2"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Your location"
              className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label
              htmlFor="organization"
              className="block text-gray-700 font-medium mb-2"
            >
              Organization
            </label>
            <input
              type="text"
              id="organization"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              placeholder="Your organization"
              className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Expertise */}
        <div className="mb-6">
          <label
            htmlFor="expertiseArea"
            className="block text-gray-700 font-medium mb-2"
          >
            Area of Expertise
          </label>
          <input
            type="text"
            id="expertiseArea"
            name="expertiseArea"
            value={formData.expertiseArea}
            onChange={handleChange}
            placeholder="Enter your expertise"
            className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Terms Agreement */}
        <div className="mb-6">
          <label
            className={`flex items-start space-x-2 ${
              formErrors.agreeToTerms ? "text-red-500" : "text-gray-700"
            }`}
          >
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleChange}
              className="mt-1 rounded text-green-600 focus:ring-green-500"
            />
            <span className="text-sm">
              I agree to the{" "}
              <a href="#" className="text-green-700 hover:text-green-800">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-green-700 hover:text-green-800">
                Privacy Policy
              </a>
            </span>
          </label>
          {formErrors.agreeToTerms && (
            <p className="text-red-500 text-sm mt-1">
              {formErrors.agreeToTerms}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center items-center space-x-2 bg-green-700 text-white py-2 px-4 rounded-md hover:bg-green-800 transition-colors disabled:bg-gray-400"
        >
          {isSubmitting ? (
            <span>Creating Account...</span>
          ) : (
            <>
              <span>Create Account</span>
              <FaArrowRightLong />
            </>
          )}
        </button>

        {/* Login Link */}
        <p className="text-center text-gray-700 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-green-700 hover:text-green-800">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;

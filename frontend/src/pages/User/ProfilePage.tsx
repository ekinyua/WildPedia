// src/pages/User/ProfilePage.tsx
import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaMapMarkerAlt,
  FaBuilding,
  FaBriefcase,
  FaEdit,
  FaSave,
  FaTimes,
  FaCamera,
} from "react-icons/fa";
import { useAuth } from "../../store/AuthContext";
import {
  updateUserProfile,
  uploadProfileImage,
  getCurrentUser,
} from "../../services/authService";

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    location: user?.location || "",
    organization: user?.organization || "",
    expertiseArea: user?.expertiseArea || "",
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: { pathname: "/profile" } } });
    } else {
      // Initialize form data from user
      setFormData({
        fullName: user.fullName || "",
        location: user.location || "",
        organization: user.organization || "",
        expertiseArea: user.expertiseArea || "",
      });
    }
  }, [user, navigate]);

  // Handle input changes
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    if (isEditing) {
      // Reset form data when canceling
      setFormData({
        fullName: user?.fullName || "",
        location: user?.location || "",
        organization: user?.organization || "",
        expertiseArea: user?.expertiseArea || "",
      });
    }
    setIsEditing(!isEditing);
    setError(null);
    setSuccess(null);
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await updateUserProfile(formData);

      // Get updated user data
      const updatedUser = getCurrentUser();
      if (updatedUser) {
        setUser(updatedUser);
      }

      setSuccess("Profile updated successfully!");
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle image upload
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const updatedUser = await uploadProfileImage(file);
      setUser(updatedUser);
      setSuccess("Profile image updated successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to upload profile image");
    } finally {
      setIsUploading(false);
    }
  };

  if (!user) {
    return null; // Will redirect in the useEffect
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-green-700 text-white p-6">
          <h1 className="text-2xl font-bold">Your Profile</h1>
          <p className="mt-2 opacity-80">
            Manage your personal information and preferences
          </p>
        </div>

        {/* Profile Content */}
        <div className="p-6">
          {/* Alerts */}
          {error && (
            <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded">
              <p>{success}</p>
            </div>
          )}

          {/* Profile Form */}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column - Photo */}
              <div className="md:col-span-1 flex flex-col items-center space-y-4">
                <div className="relative w-40 h-40 rounded-full overflow-hidden bg-gray-200">
                  {user.profileImageUrl ? (
                    <img
                      src={user.profileImageUrl}
                      alt={user.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                      <FaUser size={64} />
                    </div>
                  )}

                  {isUploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <p className="text-gray-600 text-sm mb-2">Profile photo</p>
                  <label className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer inline-block">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/jpg"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                    />
                    <FaCamera className="inline mr-2" />
                    {isUploading ? "Uploading..." : "Change Photo"}
                  </label>
                </div>
              </div>

              {/* Right Column - User Info */}
              <div className="md:col-span-2 space-y-6">
                {/* User Type Info */}
                <div className="flex items-center space-x-2 mb-6">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {user.googleId ? "Google Account" : "Email Account"}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm capitalize">
                    {user.role} Role
                  </span>
                </div>

                {/* Username & Email (Read Only) */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      <FaUser className="inline mr-2" /> Username
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your username"
                      value={user.username}
                      disabled
                      className="w-full px-3 py-2 border rounded-md bg-gray-50 text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      <FaEnvelope className="inline mr-2" /> Email
                    </label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={user.email}
                      disabled
                      className="w-full px-3 py-2 border rounded-md bg-gray-50 text-gray-600"
                    />
                  </div>
                </div>

                {/* Editable Fields */}
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-gray-700 text-sm font-bold mb-2"
                    >
                      <FaUser className="inline mr-2" /> Full Name
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-md ${
                        isEditing ? "bg-white" : "bg-gray-50"
                      }`}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="location"
                      className="block text-gray-700 text-sm font-bold mb-2"
                    >
                      <FaMapMarkerAlt className="inline mr-2" /> Location
                    </label>
                    <input
                      id="location"
                      name="location"
                      type="text"
                      value={formData.location}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-md ${
                        isEditing ? "bg-white" : "bg-gray-50"
                      }`}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="organization"
                      className="block text-gray-700 text-sm font-bold mb-2"
                    >
                      <FaBuilding className="inline mr-2" /> Organization
                    </label>
                    <input
                      id="organization"
                      name="organization"
                      type="text"
                      value={formData.organization}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-md ${
                        isEditing ? "bg-white" : "bg-gray-50"
                      }`}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="expertiseArea"
                      className="block text-gray-700 text-sm font-bold mb-2"
                    >
                      <FaBriefcase className="inline mr-2" /> Area of Expertise
                    </label>
                    <input
                      id="expertiseArea"
                      name="expertiseArea"
                      type="text"
                      value={formData.expertiseArea}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-md ${
                        isEditing ? "bg-white" : "bg-gray-50"
                      }`}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end pt-4">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        onClick={toggleEditMode}
                        className="px-4 py-2 mr-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center"
                      >
                        <FaTimes className="mr-2" /> Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                      >
                        {isLoading ? (
                          "Saving..."
                        ) : (
                          <>
                            <FaSave className="mr-2" /> Save Changes
                          </>
                        )}
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={toggleEditMode}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                    >
                      <FaEdit className="mr-2" /> Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

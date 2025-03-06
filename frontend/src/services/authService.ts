// src/services/authService.ts
import { User } from "../models";
import { authApi } from "./api/authApiClient";

// Helper to simulate API delay for mock data
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock users for testing when API is unavailable
const mockUsers = [
  {
    id: 1,
    username: "johndoe",
    email: "john@example.com",
    role: "user" as "user",
    fullName: "John Doe",
    location: "Kigali, Rwanda",
    organization: "Wildlife Conservation Society",
    expertiseArea: "Bird Watching",
  },
  {
    id: 2,
    username: "admin",
    email: "admin@example.com",
    role: "admin" as "admin",
    fullName: "Admin User",
    location: "Nairobi, Kenya",
    organization: "WildPedia Admin",
    expertiseArea: "System Administration",
  },
];

// Login function
export async function login(
  username: string,
  password: string
): Promise<{ user: User; token: string }> {
  try {
    console.log(`Attempting to login with username: ${username}`);

    // Make the API call to the login endpoint
    const response = await authApi.post<{ user: User; token: string }>(
      "/auth/login",
      {
        username,
        password,
      }
    );

    // Save token to localStorage
    localStorage.setItem("token", response.token);
    localStorage.setItem("user", JSON.stringify(response.user));

    return response;
  } catch (error) {
    console.error("Login error:", error);

    // For development only: fall back to mock data if API fails
    // Remove this in production!
    if (process.env.NODE_ENV === "development") {
      console.warn("⚠️ USING MOCK DATA - Remove this fallback in production!");
      await delay(500);

      const user = mockUsers.find((u) => u.username === username);
      if (!user || password !== "password") {
        // Simple mock password check
        throw new Error("Invalid username or password");
      }

      const token = `mock-token-${user.username}-${Date.now()}`;
      // Save token to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      return { user, token };
    }

    throw error;
  }
}

// Google login function - handles the redirect from backend
export async function handleGoogleCallback(token: string): Promise<User> {
  try {
    // Store the token received from the URL
    localStorage.setItem("token", token);

    // Fetch user details using the token
    const user = await getCurrentUserFromAPI();

    // Store user in localStorage
    localStorage.setItem("user", JSON.stringify(user));

    return user;
  } catch (error) {
    console.error("Google auth callback error:", error);
    throw error;
  }
}

// Function to get current user directly from API (not localStorage)
async function getCurrentUserFromAPI(): Promise<User> {
  try {
    const user = await authApi.get<User>("/auth/profile");
    return user;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw error;
  }
}

// Start Google authentication flow
export function initiateGoogleLogin(): void {
  const googleAuthUrl = `${
    import.meta.env.VITE_API_URL || "http://localhost:5000"
  }/api/auth/google`;
  window.location.href = googleAuthUrl;
}

// Register function
export async function register(userData: {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  location?: string;
  organization?: string;
  expertiseArea?: string;
}): Promise<{ user: User; token: string }> {
  try {
    // Map frontend fields to backend fields if they're different
    const backendData = {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      // Backend might expect different field names
      full_name: userData.fullName,
      location: userData.location,
      organization: userData.organization,
      expertise_area: userData.expertiseArea,
    };

    // Make the API call to the signup endpoint
    const response = await authApi.post<{ user: User; token: string }>(
      "/auth/signup",
      backendData
    );

    // Save token to localStorage
    localStorage.setItem("token", response.token);
    localStorage.setItem("user", JSON.stringify(response.user));

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}

// Logout function
export function logout(): void {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

// Get current user from localStorage
export function getCurrentUser(): User | null {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;

  try {
    return JSON.parse(userStr) as User;
  } catch (e) {
    console.error("Error parsing user from localStorage", e);
    return null;
  }
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return !!localStorage.getItem("token");
}

// Update user profile
export async function updateUserProfile(
  profileData: Partial<User>
): Promise<User> {
  try {
    // Map frontend fields to backend fields if they're different
    const backendData = {
      full_name: profileData.fullName,
      location: profileData.location,
      organization: profileData.organization,
      expertise_area: profileData.expertiseArea,
    };

    const response = await authApi.put<User>("/auth/profile", backendData);
    localStorage.setItem("user", JSON.stringify(response));
    return response;
  } catch (error) {
    console.error("Profile update error:", error);
    throw error;
  }
}

// Change password
export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<void> {
  try {
    await authApi.post<{ message: string }>("/auth/change-password", {
      currentPassword,
      newPassword,
    });
  } catch (error) {
    console.error("Password change error:", error);
    throw error;
  }
}

// profile image
export async function uploadProfileImage(file: File): Promise<User> {
  try {
    const formData = new FormData();
    formData.append("profileImage", file);

    // Make request
    const response = await fetch(
      `${
        import.meta.env.VITE_API_URL || "http://localhost:5000"
      }/api/users/profile-image`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to upload profile image");
    }

    const data = await response.json();

    // Update user in localStorage
    const currentUser = getCurrentUser();
    if (currentUser) {
      currentUser.profileImageUrl = data.profileImageUrl;
      localStorage.setItem("user", JSON.stringify(currentUser));
    }

    return data.user;
  } catch (error: any) {
    console.error("Error uploading profile image:", error);
    throw error;
  }
}

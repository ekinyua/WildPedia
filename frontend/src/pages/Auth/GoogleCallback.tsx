import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { handleGoogleCallback } from "../../services/authService";
import { useAuth } from "../../store/AuthContext";

const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processCallback = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setError("No authentication token received");
        setTimeout(() => {
          navigate(
            "/login?error=" + encodeURIComponent("Google authentication failed")
          );
        }, 3000);
        return;
      }

      try {
        const user = await handleGoogleCallback(token);
        setUser(user);
        navigate("/");
      } catch (err: any) {
        console.error("Error processing Google callback:", err);
        setError(err.message || "Authentication failed");
        setTimeout(() => {
          navigate(
            "/login?error=" + encodeURIComponent("Google authentication failed")
          );
        }, 3000);
      }
    };

    processCallback();
  }, [searchParams, navigate, setUser]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      {error ? (
        <div className="bg-red-100 p-4 rounded-lg text-red-700 max-w-md text-center">
          <h2 className="text-xl font-bold mb-2">Authentication Error</h2>
          <p>{error}</p>
          <p className="mt-4 text-sm">Redirecting to login page...</p>
        </div>
      ) : (
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold mb-2">Completing Authentication</h2>
          <p className="text-gray-600">
            Please wait while we complete the login process...
          </p>
        </div>
      )}
    </div>
  );
};

export default GoogleCallback;

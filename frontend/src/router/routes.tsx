// src/router/routes.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import { isAuthenticated } from "../services/authService";

// Pages
import App from "../App";
import Landing from "../pages/Home/Landing";
import SpeciesDetails from "../pages/Species/SpeciesDetails";
import SpeciesUpload from "../pages/Species/SpeciesUpload";
import Learning from "../pages/Learn/Learning";
import QuizPage from "../pages/Learn/QuizPage";
import Login from "../pages/Auth/Login";
import SignUp from "../pages/Auth/SignUp";
import ProfilePage from "../pages/User/ProfilePage";
import GoogleCallback from "../pages/Auth/GoogleCallback";
import Organizations from "../pages/Organizations/Organizations";
import NotFound from "../pages/NotFound";
import Leaderboard from "../pages/Leaderbord";

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" />;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "species/:compositeKey",
        element: <SpeciesDetails />,
      },
      {
        path: "identify",
        element: (
          <ProtectedRoute>
            <SpeciesUpload />
          </ProtectedRoute>
        ),
      },
      {
        path: "learn",
        element: <Learning />,
      },
      {
        path: "learn/:category",
        element: <QuizPage />,
      },
      {
        path: "organizations",
        element: <Organizations />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        path: "auth/google-callback",
        element: <GoogleCallback />,
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "*",
        element: <NotFound />,
      },
      {
        path: "leaderboard",
        element: <Leaderboard />,
      },
    ],
  },
]);

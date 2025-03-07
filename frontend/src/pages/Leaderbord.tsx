import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaTrophy,
  FaMedal,
  FaAward,
  FaUser,
} from "react-icons/fa";
import { useAuth } from "../store/AuthContext";
import { getLeaderboard } from "../services/learnService";
import { LeaderboardEntry } from "../models";

const Leaderboard: React.FC = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getLeaderboard(20);
        setLeaderboard(data.leaderboard);
        setUserRank(data.userRank);
      } catch (err: any) {
        console.error("Error fetching leaderboard:", err);
        setError(err.message || "Failed to load leaderboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  // Get icon based on rank
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <FaTrophy className="text-yellow-400 text-xl" />;
      case 2:
        return <FaMedal className="text-gray-400 text-xl" />;
      case 3:
        return <FaAward className="text-amber-600 text-xl" />;
      default:
        return <span className="font-bold">{rank}</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/learn"
          className="flex items-center gap-2 text-green-600 hover:text-green-700"
        >
          <FaArrowLeft /> <span>Back to Learning Center</span>
        </Link>
        <h1 className="text-2xl font-bold">Leaderboard</h1>
      </div>

      {/* Leaderboard Content */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 bg-green-100 border-b border-green-200">
          <h2 className="text-xl font-bold">Top Quiz Champions</h2>
        </div>

        {isLoading ? (
          <div className="py-20 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading leaderboard data...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* Leaderboard Table */}
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-3 px-4 text-left">Rank</th>
                  <th className="py-3 px-4 text-left">User</th>
                  <th className="py-3 px-4 text-right">XP</th>
                  <th className="py-3 px-4 text-right">Quizzes</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry) => {
                  const isCurrentUser = user && entry.user_id === user.id;

                  return (
                    <tr
                      key={entry.user_id}
                      className={`${
                        isCurrentUser
                          ? "bg-green-50 border-l-4 border-green-500"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {getRankIcon(entry.rank)}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="bg-gray-200 rounded-full p-2">
                            <FaUser className="text-gray-500" />
                          </div>
                          <span className={isCurrentUser ? "font-bold" : ""}>
                            {entry.username}
                            {isCurrentUser && " (You)"}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-semibold">
                        {entry.xp} XP
                      </td>
                      <td className="py-3 px-4 text-right">
                        {entry.quizzes_completed}
                      </td>
                    </tr>
                  );
                })}

                {leaderboard.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500">
                      No data available yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Current User Position (if not in top results) */}
            {user &&
              userRank &&
              !leaderboard.some((entry) => entry.user_id === user.id) && (
                <div className="mt-4 p-4 border-t border-gray-200 bg-green-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-bold">{userRank}</span>
                      <div className="bg-gray-200 rounded-full p-2">
                        <FaUser className="text-gray-500" />
                      </div>
                      <span className="font-bold">{user.username} (You)</span>
                    </div>
                  </div>
                </div>
              )}
          </>
        )}
      </div>

      {/* Help Text */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
        <p>
          <strong>How to earn XP:</strong> Complete quizzes to earn experience
          points. You'll earn 10 XP for each correct answer!
        </p>
      </div>
    </div>
  );
};

export default Leaderboard;

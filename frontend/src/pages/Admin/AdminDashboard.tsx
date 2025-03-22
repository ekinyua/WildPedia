import { useState, useEffect } from "react";
import {
  getDashboardSummary,
  getUserStats,
  getContentStats,
  getSpeciesStats,
} from "../../services/adminService";
import { FaUsers, FaFileAlt, FaLeaf, FaEye } from "react-icons/fa";
import {
  DashboardSummary,
  UserStatsData,
  ContentStatsData,
  SpeciesStatsData,
} from "../../models";

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [userStats, setUserStats] = useState<UserStatsData | null>(null);
  const [contentStats, setContentStats] = useState<ContentStatsData | null>(
    null
  );
  const [speciesStats, setSpeciesStats] = useState<SpeciesStatsData | null>(
    null
  );

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch all dashboard data in parallel
        const [summaryData, userData, contentData, speciesData] =
          await Promise.all([
            getDashboardSummary(),
            getUserStats(),
            getContentStats(),
            getSpeciesStats(),
          ]);

        setSummary(summaryData);
        setUserStats(userData);
        setContentStats(contentData);
        setSpeciesStats(speciesData);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm flex items-center">
          <div className="rounded-full bg-blue-100 p-3">
            <FaUsers className="text-blue-500 text-xl" />
          </div>
          <div className="ml-4">
            <h3 className="text-gray-500 text-sm">Total Users</h3>
            <p className="text-2xl font-bold">
              {summary?.users?.total_users || 0}
            </p>
            <p className="text-sm text-green-500">
              {summary?.users?.new_users_week || 0} new this week
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm flex items-center">
          <div className="rounded-full bg-green-100 p-3">
            <FaFileAlt className="text-green-500 text-xl" />
          </div>
          <div className="ml-4">
            <h3 className="text-gray-500 text-sm">Cultural Content</h3>
            <p className="text-2xl font-bold">
              {summary?.content?.total_content || 0}
            </p>
            <p className="text-sm text-yellow-500">
              {summary?.content?.pending_moderation || 0} pending review
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm flex items-center">
          <div className="rounded-full bg-purple-100 p-3">
            <FaLeaf className="text-purple-500 text-xl" />
          </div>
          <div className="ml-4">
            <h3 className="text-gray-500 text-sm">Species</h3>
            <p className="text-2xl font-bold">
              {summary?.species?.total_species || 0}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm flex items-center">
          <div className="rounded-full bg-orange-100 p-3">
            <FaEye className="text-orange-500 text-xl" />
          </div>
          <div className="ml-4">
            <h3 className="text-gray-500 text-sm">Total Views</h3>
            <p className="text-2xl font-bold">
              {summary?.views?.total_views || 0}
            </p>
            <p className="text-sm text-green-500">
              {summary?.views?.views_this_week || 0} views this week
            </p>
          </div>
        </div>
      </div>

      {/* User & Content Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4">User Distribution</h2>
          {userStats?.roleDistribution && (
            <div className="space-y-4">
              {userStats.roleDistribution.map((role) => (
                <div key={role.role} className="flex flex-col">
                  <div className="flex justify-between mb-1">
                    <span className="capitalize">{role.role}s</span>
                    <span>{role.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${
                          summary?.users?.total_users
                            ? (role.count / summary.users.total_users) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4">Content Status</h2>
          {contentStats?.statusDistribution && (
            <div className="space-y-4">
              {contentStats.statusDistribution.map((status) => (
                <div key={status.status} className="flex flex-col">
                  <div className="flex justify-between mb-1">
                    <span className="capitalize">{status.status}</span>
                    <span>{status.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        status.status === "approved"
                          ? "bg-green-500"
                          : status.status === "pending"
                          ? "bg-yellow-500"
                          : status.status === "rejected"
                          ? "bg-red-500"
                          : "bg-gray-500"
                      }`}
                      style={{
                        width: `${
                          summary?.content?.total_content
                            ? (status.count / summary.content.total_content) *
                              100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Species Information */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4">Kingdom Distribution</h2>
        {speciesStats?.kingdomDistribution && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {speciesStats.kingdomDistribution.map((kingdom) => (
              <div key={kingdom.kingdom} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-lg">
                  {kingdom.kingdom || "Unknown"}
                </h3>
                <p className="text-2xl font-bold text-green-600">
                  {kingdom.count}
                </p>
                <p className="text-sm text-gray-500">species</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

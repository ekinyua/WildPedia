import { useState, useEffect } from "react";
import {
  getTopViewedSpecies,
  getTopSearches,
} from "../../services/adminService";
import { FaEye, FaSearch } from "react-icons/fa";
import { TopViewedSpecies, TopSearch } from "../../models";

const Analytics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topSpecies, setTopSpecies] = useState<TopViewedSpecies[]>([]);
  const [topSearches, setTopSearches] = useState<TopSearch[]>([]);
  const [timeRange, setTimeRange] = useState(30); // days

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    try {
      const [speciesData, searchesData] = await Promise.all([
        getTopViewedSpecies(10, timeRange),
        getTopSearches(10, timeRange),
      ]);

      setTopSpecies(speciesData);
      setTopSearches(searchesData);
    } catch (err) {
      console.error("Error fetching analytics data:", err);
      setError("Failed to load analytics data");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate maximum values
  const maxViews = Math.max(...topSpecies.map((item) => item.view_count), 1);
  const maxSearches = Math.max(
    ...topSearches.map((item) => item.search_count),
    1
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics Dashboard</h1>

      {/* Time Range Selector */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <label className="block text-gray-700 font-medium mb-2">
          Time Range
        </label>
        <div className="flex space-x-4">
          <button
            onClick={() => setTimeRange(7)}
            className={`px-4 py-2 rounded-md ${
              timeRange === 7
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Last 7 days
          </button>
          <button
            onClick={() => setTimeRange(30)}
            className={`px-4 py-2 rounded-md ${
              timeRange === 30
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Last 30 days
          </button>
          <button
            onClick={() => setTimeRange(90)}
            className={`px-4 py-2 rounded-md ${
              timeRange === 90
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Last 90 days
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Viewed Species */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <FaEye className="text-blue-500 mr-2" />
              <h2 className="text-xl font-bold">Most Viewed Species</h2>
            </div>

            {topSpecies.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No view data available for this period
              </p>
            ) : (
              <div className="space-y-3">
                {topSpecies.map((item, index) => (
                  <div key={item.species_id} className="flex items-center">
                    <span className="w-6 font-bold text-gray-500">
                      {index + 1}.
                    </span>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">
                          {item.scientific_name}
                        </span>
                        <span>{item.view_count} views</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{
                            width: `${(item.view_count / maxViews) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Searches */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <FaSearch className="text-green-500 mr-2" />
              <h2 className="text-xl font-bold">Most Common Searches</h2>
            </div>

            {topSearches.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No search data available for this period
              </p>
            ) : (
              <div className="space-y-3">
                {topSearches.map((item, index) => (
                  <div key={item.query_text} className="flex items-center">
                    <span className="w-6 font-bold text-gray-500">
                      {index + 1}.
                    </span>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">"{item.query_text}"</span>
                        <span>{item.search_count} searches</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{
                            width: `${
                              (item.search_count / maxSearches) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;

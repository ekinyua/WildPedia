import { useState, useEffect } from "react";
import { getUserList, updateUserStatus } from "../../services/adminService";
import {
  FaSearch,
  FaUserSlash,
  FaUserCheck,
  FaInfoCircle,
} from "react-icons/fa";
import { User } from "../../models";

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [page, searchQuery]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await getUserList({
        query: searchQuery,
        limit: 10,
        offset: (page - 1) * 10,
      });

      setUsers(response.users);
      setTotalPages(response.totalPages);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load user data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleUserStatus = async (
    userId: number,
    currentStatus: boolean
  ) => {
    if (
      window.confirm(
        `Are you sure you want to ${
          currentStatus ? "disable" : "enable"
        } this user?`
      )
    ) {
      setIsLoading(true);
      try {
        await updateUserStatus(userId, !currentStatus);
        fetchUsers(); // Refresh the list
      } catch (err) {
        console.error("Error updating user status:", err);
        setError("Failed to update user status");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const viewUserDetails = (user: User) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">User Management</h1>

      {/* Search Bar */}
      <div className="relative w-full md:w-96">
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-md"
        />
        <FaSearch className="absolute left-3 top-3 text-gray-400" />
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-green-500 mx-auto"></div>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        {user.profileImageUrl ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={user.profileImageUrl}
                            alt={user.username}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500">
                              {user.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.username}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 capitalize">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.is_active ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => viewUserDetails(user)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View details"
                      >
                        <FaInfoCircle />
                      </button>
                      <button
                        onClick={() =>
                          handleToggleUserStatus(user.id, user.is_active)
                        }
                        className={`${
                          user.is_active
                            ? "text-red-600 hover:text-red-900"
                            : "text-green-600 hover:text-green-900"
                        }`}
                        title={user.is_active ? "Disable user" : "Enable user"}
                      >
                        {user.is_active ? <FaUserSlash /> : <FaUserCheck />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <div className="flex space-x-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {showDetailsModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">User Details</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Username
                  </h3>
                  <p className="text-lg">{selectedUser.username}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="text-lg">{selectedUser.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Role</h3>
                  <p className="capitalize text-lg">{selectedUser.role}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p className="text-lg">
                    {selectedUser.is_active ? "Active" : "Disabled"}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Full Name
                  </h3>
                  <p className="text-lg">{selectedUser.fullName || "-"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Location
                  </h3>
                  <p className="text-lg">{selectedUser.location || "-"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Organization
                  </h3>
                  <p className="text-lg">{selectedUser.organization || "-"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Expertise
                  </h3>
                  <p className="text-lg">{selectedUser.expertiseArea || "-"}</p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3 border-t pt-4">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 border text-gray-700 rounded-md hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleToggleUserStatus(
                    selectedUser.id,
                    selectedUser.is_active
                  );
                  setShowDetailsModal(false);
                }}
                className={`px-4 py-2 rounded-md ${
                  selectedUser.is_active
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {selectedUser.is_active ? "Disable User" : "Enable User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;

import { useState, useEffect } from "react";
import {
  getModerationQueue,
  moderateContent,
  bulkModerateContent,
} from "../../services/adminService";
import { FaCheck, FaTimes, FaEye } from "react-icons/fa";
import { ModerationContent } from "../../models";

const ContentModeration = () => {
  const [content, setContent] = useState<ModerationContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [viewingContent, setViewingContent] =
    useState<ModerationContent | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("pending");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [rejectReason, setRejectReason] = useState<string>("");
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);
  const [currentItemId, setCurrentItemId] = useState<number | null>(null);

  useEffect(() => {
    fetchContent();
  }, [statusFilter, typeFilter, page]);

  const fetchContent = async () => {
    setIsLoading(true);
    try {
      const response = await getModerationQueue({
        status: statusFilter,
        contentType: typeFilter,
        limit: 10,
        offset: (page - 1) * 10,
      });

      setContent(response.content);
      setTotalPages(response.totalPages);
    } catch (err) {
      console.error("Error fetching content for moderation:", err);
      setError("Failed to load content data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectItem = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.length === content.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(content.map((item) => item.id));
    }
  };

  const handleViewContent = (item: ModerationContent) => {
    setViewingContent(item);
  };

  const handleApproveContent = async (id: number) => {
    setIsLoading(true);
    try {
      await moderateContent(id, {
        status: "approved",
      });

      // Refresh content list
      fetchContent();
    } catch (err) {
      console.error("Error approving content:", err);
      setError("Failed to approve content");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowRejectModal = (id: number) => {
    setCurrentItemId(id);
    setRejectReason("");
    setShowRejectModal(true);
  };

  const handleRejectContent = async () => {
    if (currentItemId === null) return;

    setIsLoading(true);
    try {
      await moderateContent(currentItemId, {
        status: "rejected",
        reason: rejectReason,
      });

      // Close modal and refresh
      setShowRejectModal(false);
      fetchContent();
    } catch (err) {
      console.error("Error rejecting content:", err);
      setError("Failed to reject content");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkAction = async (status: "approved" | "rejected") => {
    if (selectedItems.length === 0) return;

    setIsLoading(true);
    try {
      await bulkModerateContent({
        contentIds: selectedItems,
        status,
        reason: status === "rejected" ? "Bulk rejection" : "",
      });

      // Clear selection and refresh
      setSelectedItems([]);
      fetchContent();
    } catch (err) {
      console.error("Error performing bulk action:", err);
      setError("Failed to perform bulk action");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Content Moderation</h1>

      {/* Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-48 px-4 py-2 border rounded-md"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Content Type
          </label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full md:w-48 px-4 py-2 border rounded-md"
          >
            <option value="">All Types</option>
            <option value="myth">Myths</option>
            <option value="legend">Legends</option>
            <option value="proverb">Proverbs</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-md flex flex-col md:flex-row items-center justify-between">
          <p className="text-blue-700">
            {selectedItems.length} item(s) selected
          </p>
          <div className="flex space-x-3 mt-2 md:mt-0">
            <button
              onClick={() => handleBulkAction("approved")}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-1"
            >
              <FaCheck /> Approve All
            </button>
            <button
              onClick={() => handleBulkAction("rejected")}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1"
            >
              <FaTimes /> Reject All
            </button>
          </div>
        </div>
      )}

      {/* Content Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={
                    selectedItems.length === content.length &&
                    content.length > 0
                  }
                  onChange={handleSelectAll}
                  className="rounded"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date Submitted
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
            ) : content.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  No content found with current filters
                </td>
              </tr>
            ) : (
              content.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {item.title}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 capitalize">
                      {item.content_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {item.author_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewContent(item)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View"
                      >
                        <FaEye />
                      </button>

                      {statusFilter === "pending" && (
                        <>
                          <button
                            onClick={() => handleApproveContent(item.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Approve"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={() => handleShowRejectModal(item.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Reject"
                          >
                            <FaTimes />
                          </button>
                        </>
                      )}
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

      {/* View Content Modal */}
      {viewingContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{viewingContent.title}</h2>
              <button
                onClick={() => setViewingContent(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>

            <div className="mb-4">
              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 capitalize">
                {viewingContent.content_type}
              </span>
              <span className="ml-2 text-gray-500 text-sm">
                By {viewingContent.author_name}
              </span>
            </div>

            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <p className="whitespace-pre-line">{viewingContent.content}</p>
            </div>

            {statusFilter === "pending" && (
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    handleApproveContent(viewingContent.id);
                    setViewingContent(null);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-1"
                >
                  <FaCheck /> Approve
                </button>
                <button
                  onClick={() => {
                    handleShowRejectModal(viewingContent.id);
                    setViewingContent(null);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1"
                >
                  <FaTimes /> Reject
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Reject Content</h2>
              <button
                onClick={() => setShowRejectModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Reason for Rejection
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border rounded-md resize-none"
                placeholder="Please provide a reason for rejecting this content"
              ></textarea>
            </div>

            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 border text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectContent}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400"
              >
                {isLoading ? "Rejecting..." : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentModeration;

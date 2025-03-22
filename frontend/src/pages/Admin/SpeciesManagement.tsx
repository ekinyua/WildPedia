import { useState, useEffect } from "react";
import {
  getSpeciesList,
  createSpecies,
  updateSpecies,
} from "../../services/adminService";
import { FaPlus, FaEdit, FaSearch, FaTimesCircle } from "react-icons/fa";
import { SpeciesListItem } from "../../models";

interface FormDataState {
  scientific_name: string;
  vernacular_names: string;
  description: string;
  kingdom: string;
  kingdom_key: number;
  class_name: string;
  class_key: number | null;
  image: File | null;
  threat_status: string;
  habitat: string;
}

const SpeciesManagement = () => {
  const [species, setSpecies] = useState<SpeciesListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [selectedSpecies, setSelectedSpecies] =
    useState<SpeciesListItem | null>(null);
  const [formData, setFormData] = useState<FormDataState>({
    scientific_name: "",
    vernacular_names: "",
    description: "",
    kingdom: "Animalia",
    kingdom_key: 1,
    class_name: "",
    class_key: null,
    image: null,
    threat_status: "",
    habitat: "",
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchSpecies();
  }, [page, searchQuery]);

  const fetchSpecies = async () => {
    setIsLoading(true);
    try {
      const response = await getSpeciesList({
        query: searchQuery,
        limit: 10,
        offset: (page - 1) * 10,
      });

      setSpecies(response.species);
      setTotalPages(response.totalPages);
    } catch (err) {
      console.error("Error fetching species:", err);
      setError("Failed to load species data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;

    if (name === "image" && files && files[0]) {
      setFormData({ ...formData, [name]: files[0] });

      // Create preview URL
      const url = URL.createObjectURL(files[0]);
      setPreviewUrl(url);

      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const resetForm = () => {
    setFormData({
      scientific_name: "",
      vernacular_names: "",
      description: "",
      kingdom: "Animalia",
      kingdom_key: 1,
      class_name: "",
      class_key: null,
      image: null,
      threat_status: "",
      habitat: "",
    });
    setPreviewUrl(null);
    setSelectedSpecies(null);
  };

  const openEditForm = (species: SpeciesListItem) => {
    setSelectedSpecies(species);
    setFormData({
      scientific_name: species.scientific_name,
      vernacular_names: Array.isArray(species.vernacular_names)
        ? JSON.stringify(species.vernacular_names)
        : "",
      description: "",
      kingdom: species.kingdom || "Animalia",
      kingdom_key: species.kingdom_key || 1,
      class_name: species.class || "",
      class_key: species.class_key || null,
      image: null,
      threat_status: "",
      habitat: "",
    });
    setPreviewUrl(species.image_url || null);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const form = new FormData();

      // Add all form fields to FormData
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "image" && value) {
          form.append("image", value);
        } else if (value !== null && value !== undefined) {
          form.append(key, String(value));
        }
      });

      if (selectedSpecies) {
        // Update existing species
        await updateSpecies(selectedSpecies.composite_key, form);
      } else {
        // Create new species
        await createSpecies(form);
      }

      // Refresh species list
      fetchSpecies();
      setShowForm(false);
      resetForm();
    } catch (err) {
      console.error("Error saving species:", err);
      setError("Failed to save species data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Species Management</h1>

      {/* Search and Add Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search species..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center justify-center gap-2"
        >
          <FaPlus /> Add New Species
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Species Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Scientific Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kingdom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Class
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-green-500 mx-auto"></div>
                </td>
              </tr>
            ) : species.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  No species found
                </td>
              </tr>
            ) : (
              species.map((item) => (
                <tr key={item.composite_key}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={item.image_url || "/placeholder.jpg"}
                          alt={item.scientific_name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {item.vernacular_names?.[0] || "No common name"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 italic">
                      {item.scientific_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.kingdom}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {item.class || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openEditForm(item)}
                      className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1"
                    >
                      <FaEdit /> Edit
                    </button>
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

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {selectedSpecies ? "Edit Species" : "Add New Species"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimesCircle />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Scientific Name*
                  </label>
                  <input
                    type="text"
                    name="scientific_name"
                    value={formData.scientific_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Common Names
                  </label>
                  <input
                    type="text"
                    name="vernacular_names"
                    value={formData.vernacular_names}
                    onChange={handleInputChange}
                    placeholder='["Name1", "Name2"] or "Name"'
                    className="w-full px-4 py-2 border rounded-md"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter as JSON array or single name
                  </p>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Kingdom
                  </label>
                  <select
                    name="kingdom"
                    value={formData.kingdom}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-md"
                  >
                    <option value="Animalia">Animalia</option>
                    <option value="Plantae">Plantae</option>
                    <option value="Fungi">Fungi</option>
                    <option value="Protista">Protista</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Class
                  </label>
                  <input
                    type="text"
                    name="class_name"
                    value={formData.class_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Threat Status
                  </label>
                  <select
                    name="threat_status"
                    value={formData.threat_status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-md"
                  >
                    <option value="">Select status</option>
                    <option value="Least Concern">Least Concern</option>
                    <option value="Near Threatened">Near Threatened</option>
                    <option value="Vulnerable">Vulnerable</option>
                    <option value="Endangered">Endangered</option>
                    <option value="Critically Endangered">
                      Critically Endangered
                    </option>
                    <option value="Extinct in the Wild">
                      Extinct in the Wild
                    </option>
                    <option value="Extinct">Extinct</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Habitat
                  </label>
                  <input
                    type="text"
                    name="habitat"
                    value={formData.habitat}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border rounded-md resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Image
                </label>
                <input
                  type="file"
                  name="image"
                  onChange={handleInputChange}
                  accept="image/*"
                  className="w-full"
                />
                {previewUrl && (
                  <div className="mt-2">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="h-32 object-contain"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
                >
                  {isLoading ? "Saving..." : "Save Species"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeciesManagement;

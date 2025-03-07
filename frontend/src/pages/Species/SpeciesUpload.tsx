import { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { identifySpeciesFromImage } from "../../services/speciesService";
import { Species } from "../../models";
import { useNavigate } from "react-router-dom";

const SpeciesUpload = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [identifiedSpecies, setIdentifiedSpecies] = useState<Species | null>(
    null
  );
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [allDetections, setAllDetections] = useState<
    Array<{ name: string; score: number; type: string }>
  >([]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setUploadError(null);
    setIdentifiedSpecies(null);
    setAllDetections([]);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  // Handle file drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0] || null;
    setSelectedFile(file);
    setUploadError(null);
    setIdentifiedSpecies(null);
    setAllDetections([]);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  // Handle upload and identification
  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError("Please select an image first");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      // Call API to identify species
      const result = await identifySpeciesFromImage(selectedFile);

      const objectDetection = result.allDetections.find(
        (d) => d.type === "object"
      );

      const speciesName = objectDetection?.name || result.species;
      const confidenceValue = (objectDetection?.score ?? 0) * 100;

      const identifiedSpecies = {
        key: 0, // Temporary key
        scientificName: speciesName,
        vernacularNames: [speciesName],
        rank: "SPECIES",
        kingdom: "Unknown",
        phylum: "Unknown",
        family: "Unknown",
        description: `This appears to be a ${speciesName}. You can search our database for more information about this species.`,
        confidenceScore: confidenceValue,
      };

      setIdentifiedSpecies(identifiedSpecies);
      setConfidenceScore(confidenceValue);
      setAllDetections(result.allDetections);
    } catch (error: any) {
      console.error("Error identifying species:", error);
      setUploadError(error.message || "Failed to identify species");
    } finally {
      setIsUploading(false);
    }
  };

  // Navigate to species details
  const viewSpeciesDetails = () => {
    if (identifiedSpecies?.compositeKey) {
      navigate(`/species/${identifiedSpecies.compositeKey}`);
    } else if (identifiedSpecies?.scientificName) {
      // If no composite key (external species), search for it
      navigate(
        `/?search=${encodeURIComponent(identifiedSpecies.scientificName)}`
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold mb-6">Identify Species</h1>

      {/* Upload Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="font-bold text-xl mb-4">Upload an Image</h2>
        <div
          className="flex flex-col items-center justify-center space-y-4 border-2 border-dashed border-gray-300 rounded-lg p-8 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-upload")?.click()}
        >
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            title="Upload an image"
          />
          <FaCloudUploadAlt size={40} className="text-gray-400" />
          <p className="text-gray-600">
            Drag and drop your image here, or click to browse
          </p>
          <button
            type="button"
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Select Image
          </button>
        </div>

        {previewUrl && (
          <div className="mt-4">
            <div className="relative">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-80 mx-auto rounded-md"
              />
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors w-full disabled:bg-gray-400"
              >
                {isUploading ? "Identifying..." : "Identify Species"}
              </button>
            </div>
          </div>
        )}

        {uploadError && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
            {uploadError}
          </div>
        )}
      </div>

      {/* Results Section */}
      {identifiedSpecies && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Species Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Identified Species */}
            <div className="border border-gray-200 rounded-md p-4">
              <img
                src={previewUrl || "/placeholder.jpg"}
                alt={identifiedSpecies.scientificName}
                className="h-40 w-full object-contain rounded-md mb-4"
              />
              <h3 className="text-lg font-bold">Detected Species</h3>
              <p className="mb-2">
                {identifiedSpecies.vernacularNames?.[0] ||
                  identifiedSpecies.scientificName}
              </p>
              <p className="italic text-gray-600 mb-4">
                {identifiedSpecies.scientificName}
              </p>
              <div>
                <label className="block mb-2">
                  Confidence Score: {confidenceScore.toFixed(0)}%
                </label>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-green-600 h-2.5 rounded-full"
                    style={{ width: `${confidenceScore}%` }}
                  ></div>
                </div>
              </div>
              <button
                onClick={viewSpeciesDetails}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
              >
                Search Database
              </button>
            </div>
            s
            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded-md">
                <h3 className="font-bold mb-2">Species Information</h3>
                <p className="text-gray-700 text-sm">
                  {identifiedSpecies.description}
                </p>
              </div>

              {allDetections.length > 0 && (
                <div className="bg-gray-100 p-4 rounded-md">
                  <h3 className="font-bold mb-2">All Detections</h3>
                  <div className="max-h-40 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left border-b">
                          <th className="pb-2">Label</th>
                          <th className="pb-2">Confidence</th>
                          <th className="pb-2">Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allDetections.map((detection, index) => (
                          <tr key={index} className="border-b border-gray-200">
                            <td className="py-1">{detection.name}</td>
                            <td className="py-1">
                              {Math.round(detection.score * 100)}%
                            </td>
                            <td className="py-1 capitalize">
                              {detection.type}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="bg-yellow-50 p-4 rounded-md">
                <h3 className="font-bold mb-2">Note</h3>
                <p className="text-sm text-yellow-800">
                  This identification is based on image recognition technology
                  and may not be 100% accurate. For definitive species
                  identification, please consult with a specialist.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeciesUpload;

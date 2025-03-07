import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaLanguage,
  FaPlus,
  FaThumbsUp,
  FaThumbsDown,
  FaHome,
} from "react-icons/fa";
import { GiHabitatDome } from "react-icons/gi";
import { MdFactCheck, MdOutlineNature } from "react-icons/md";
import { Species, CulturalContent, SpeciesFact } from "../../models";
import {
  getSpeciesDetails,
  getSpeciesCulturalContent,
  getSpeciesFacts,
} from "../../services/speciesService";

const SpeciesDetails = () => {
  const { compositeKey } = useParams<{ compositeKey: string }>();
  const [species, setSpecies] = useState<Species | null>(null);
  const [culturalContent, setCulturalContent] = useState<CulturalContent[]>([]);
  const [facts, setFacts] = useState<SpeciesFact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeLanguage, setActiveLanguage] = useState<"en" | "rw" | "sw">(
    "en"
  );

  useEffect(() => {
    const fetchSpeciesData = async () => {
      if (!compositeKey) return;

      setIsLoading(true);
      setError(null);

      try {
        // Fetch species details
        const speciesData = await getSpeciesDetails(compositeKey);
        console.log("Species data:", speciesData);
        setSpecies(speciesData);

        // Fetch cultural content
        const contentData = await getSpeciesCulturalContent(
          compositeKey,
          activeLanguage
        );
        setCulturalContent(contentData);

        // Fetch scientific facts
        const factsData = await getSpeciesFacts(compositeKey);
        setFacts(factsData);
      } catch (err: any) {
        console.error("Error fetching species data:", err);
        setError(err.message || "Failed to load species data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpeciesData();
  }, [compositeKey, activeLanguage]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [compositeKey]);

  const handleLanguageChange = (language: "en" | "rw" | "sw") => {
    setActiveLanguage(language);
  };

  // Function to get myths and legends from cultural content
  const getMyths = () => {
    return culturalContent.filter(
      (content) =>
        content.contentType === "myth" || content.contentType === "legend"
    );
  };

  // Function to get proverbs from cultural content
  const getProverbs = () => {
    return culturalContent.filter(
      (content) => content.contentType === "proverb"
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading species information...</p>
        </div>
      </div>
    );
  }

  if (error || !species) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-red-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-red-700 mb-2">Error</h2>
          <p className="text-gray-700">{error || "Species not found"}</p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="absolute top-4 left-4 z-10">
        <Link
          to="/"
          className="bg-white bg-opacity-80 p-2 rounded-full text-green-600 hover:text-green-700 hover:bg-opacity-100 transition-colors"
        >
          <FaHome size={24} />
        </Link>
      </div>

      <div className="relative">
        <div className="h-80 bg-gray-300">
          {species.image && (
            <img
              src={species.image}
              alt={species.scientificName}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
          <h1 className="text-3xl font-bold text-white">
            {species.scientificName}
          </h1>
          <div className="flex flex-wrap gap-x-6 mt-2 text-white text-sm">
            <p>
              Scientific Name:{" "}
              <span className="italic">{species.scientificName}</span>
            </p>
            {species.vernacularNames && species.vernacularNames.length > 0 && (
              <p>Local Name: {species.vernacularNames[0]}</p>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <section>
          <h2 className="text-xl font-bold mb-4">Description</h2>
          <p className="text-gray-700">
            {species.description ||
              "A large evergreen tree native to the mountainous regions of Africa, reaching heights of up to 40 meters."}
          </p>

          <div className="flex flex-wrap gap-2 mt-4">
            <button
              className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-md text-sm"
              onClick={() => handleLanguageChange("rw")}
            >
              <FaLanguage /> Translate to Kinyarwanda
            </button>
            <button
              className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
              onClick={() => handleLanguageChange("sw")}
            >
              <FaLanguage /> Translate to Swahili
            </button>
            <div className="ml-auto flex gap-2">
              <button
                className="text-gray-500 hover:text-gray-700"
                title="Like"
              >
                <FaThumbsUp />
              </button>
              <button
                className="text-gray-500 hover:text-gray-700"
                title="Dislike"
              >
                <FaThumbsDown />
              </button>
            </div>
          </div>
        </section>

        <section className="border-t pt-4">
          <h2 className="text-xl font-bold mb-4">Myths & Legends</h2>
          {getMyths().length > 0 ? (
            <div className="space-y-3">
              {getMyths().map((content) => (
                <div key={content.id}>
                  <p className="text-gray-700">{content.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">
              Traditional myth content goes here...
            </p>
          )}
        </section>

        <section className="border-t pt-4">
          <h2 className="text-xl font-bold mb-4">Local Proverbs</h2>
          {getProverbs().length > 0 ? (
            <div className="space-y-3">
              {getProverbs().map((content) => (
                <div key={content.id}>
                  <p className="text-gray-700">{content.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">
              Local proverbs content goes here...
            </p>
          )}
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-4">
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Quick Facts</h3>

            <div className="space-y-3">
              {species.habitat && (
                <div className="flex gap-2 items-start">
                  <span className="text-green-600 mt-1">
                    <GiHabitatDome />
                  </span>
                  <div>
                    <span className="font-medium">Habitat: </span>
                    <span>{species.habitat}</span>
                  </div>
                </div>
              )}

              {species.threat_status && (
                <div className="flex gap-2 items-start">
                  <span className="text-green-600 mt-1">
                    <MdFactCheck />
                  </span>
                  <div>
                    <span className="font-medium">Conservation Status: </span>
                    <span>{species.threat_status}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold">Add Information</h3>
            <button className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition flex items-center justify-center gap-2">
              <FaPlus /> Add New Entry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeciesDetails;

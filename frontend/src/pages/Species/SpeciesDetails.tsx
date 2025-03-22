import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaLanguage,
  FaPlus,
  FaThumbsUp,
  FaThumbsDown,
  FaHome,
  FaTimes,
} from "react-icons/fa";
import { GiHabitatDome } from "react-icons/gi";
import { MdFactCheck } from "react-icons/md";
import { Species, CulturalContent, SpeciesFact } from "../../models";
import {
  getSpeciesDetails,
  getSpeciesCulturalContent,
  getSpeciesFacts,
  deleteCulturalContent,
} from "../../services/speciesService";
import { useAuth } from "../../store/AuthContext";
import AddCulturalContentForm from "../../components/common/AddCulturalContentForm/AddCulturalContentForm";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../../services/authService";
import { voteForContent } from "../../services/speciesService";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";
import { api } from "../../services/api/apiClient";

const SpeciesDetails = () => {
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { compositeKey } = useParams<{ compositeKey: string }>();
  const [species, setSpecies] = useState<Species | null>(null);
  const [culturalContent, setCulturalContent] = useState<CulturalContent[]>([]);
  const [facts, setFacts] = useState<SpeciesFact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeLanguage, setActiveLanguage] = useState<"en" | "rw" | "sw">(
    "en"
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [editingContent, setEditingContent] = useState<CulturalContent | null>(
    null
  );
  const viewRecorded = useRef(false);

  // Handler for edit button
  const handleEditContent = (content: CulturalContent) => {
    setEditingContent(content);
    setShowModal(true);
  };

  // Handler for delete button
  const handleDeleteContent = async (contentId: number) => {
    if (window.confirm("Are you sure you want to delete this content?")) {
      try {
        await deleteCulturalContent(contentId);
        await refreshCulturalContent();
      } catch (error) {
        console.error("Error deleting content:", error);
      }
    }
  };

  const handleVote = async (contentId: number, direction: "up" | "down") => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await voteForContent(contentId, direction);
      await refreshCulturalContent();
    } catch (error) {
      console.error(`Error voting for content:`, error);
    }
  };

  const [defaultContentType, setDefaultContentType] = useState<
    "myth" | "legend" | "proverb"
  >("myth");

  const getStatusColor = (status?: string) => {
    if (!status) return "bg-gray-300/40";

    const statusLower = status.toLowerCase();

    // Check for substrings instead of exact matches
    if (statusLower.includes("least concern"))
      return "bg-green-500/40 text-green-800";
    if (statusLower.includes("near threatened"))
      return "bg-yellow-500/40 text-yellow-800";
    if (statusLower.includes("vulnerable"))
      return "bg-orange-500/40 text-orange-800";
    if (
      statusLower.includes("endangered") &&
      !statusLower.includes("critically")
    )
      return "bg-red-500/40 text-white-800";
    if (statusLower.includes("critically")) return "bg-red-600/70 text-black";
    if (statusLower.includes("extinct")) return "bg-black/60 text-gray-500";

    return "bg-gray-300/40";
  };

  const refreshCulturalContent = async () => {
    if (!compositeKey) return;
    try {
      const contentData = await getSpeciesCulturalContent(
        compositeKey,
        activeLanguage
      );
      setCulturalContent(contentData);
      setShowModal(false);
    } catch (err) {
      console.error("Error refreshing cultural content:", err);
    }
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", {
        state: { from: { pathname: window.location.pathname } },
      });
    }
  }, [navigate]);

  useEffect(() => {
    const fetchSpeciesData = async () => {
      if (!compositeKey) return;

      setIsLoading(true);
      setError(null);

      try {
        // Fetch species details
        const speciesData = await getSpeciesDetails(compositeKey);
        console.log("Species data:", speciesData);
        console.log("Composite key from API:", speciesData.compositeKey);
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

  //   animal sounds
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    const recordView = async () => {
      // Skip if we've already recorded a view in this component lifecycle
      if (!compositeKey || viewRecorded.current) return;

      // Mark that we've recorded a view
      viewRecorded.current = true;

      try {
        const sessionId =
          localStorage.getItem("sessionId") ||
          Math.random().toString(36).substring(2, 15);
        localStorage.setItem("sessionId", sessionId);

        await api.post(
          `/api/admin/analytics/view/${compositeKey}`,
          { sessionId },
          { headers: { "x-session-id": sessionId } }
        );

        console.log("Successfully recorded view for:", compositeKey);
      } catch (error) {
        console.error("Error recording view:", error);
      }
    };

    recordView();
  }, [compositeKey]);

  const toggleSound = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    } else {
      audioRef.current
        .play()
        .catch((e) => console.error("Audio playback error:", e));
    }
    setIsPlaying(!isPlaying);
  };

  const handleLanguageChange = (language: "en" | "rw" | "sw") => {
    setActiveLanguage(language);
  };

  // Function to get myths and legends from cultural content
  const getMyths = () => {
    console.log("cultural content", culturalContent);
    return culturalContent.filter((content) => {
      console.log("Content Type:", content.content_type);
      return (
        content.content_type === "myth" || content.content_type === "legend"
      );
    });
  };

  // Function to get proverbs from cultural content
  const getProverbs = () => {
    return culturalContent.filter(
      (content) => content.content_type === "proverb"
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
            title="back"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden relative">
      <div className="absolute top-5 left-4 z-10 rounded-md">
        <Link
          to="/"
          className="flex bg-opacity-40 text-black hover:bg-opacity-100 transition-colors items-center justify-center cursor-pointer"
        >
          <FaHome
            size={24}
            className="hover:bg-green-400 cursor-pointer rounded-md ring-1 ring-offset-1 ring-green-400 ring-opacity-60"
          />
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
          {species.sound_url && (
            <div className="mt-4">
              <button
                onClick={toggleSound}
                className="flex items-center gap-1 bg-green-700 text-white text-sm px-3 py-1 rounded-lg hover:bg-green-600 cursor-pointer ring-2 ring-offset-1 ring-green-400 ring-opacity-60
  shadow-lg shadow-green-400/50
  transition-all duration-200"
              >
                {isPlaying ? <FaVolumeMute /> : <FaVolumeUp />}
                {isPlaying ? "Stop" : "Listen to"}{" "}
                {species.vernacularNames?.[0] || species.scientificName}
              </button>
              <audio
                ref={audioRef}
                src={species.sound_url}
                onEnded={() => setIsPlaying(false)}
                preload="none"
              />
            </div>
          )}

          <div className="flex flex-wrap gap-2 mt-4">
            <button
              className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-md text-sm cursor-pointer"
              onClick={() => handleLanguageChange("rw")}
              title="Translate to Kinyarwanda"
            >
              <FaLanguage /> Translate to Kinyarwanda
            </button>
            <button
              className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-md text-sm cursor-pointer"
              onClick={() => handleLanguageChange("sw")}
              title="Translate to Swahili"
            >
              <FaLanguage /> Translate to Swahili
            </button>
            <div className="ml-auto flex gap-2">
              <button
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
                title="Like"
              >
                <FaThumbsUp />
              </button>
              <button
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
                title="Dislike"
              >
                <FaThumbsDown />
              </button>
            </div>
          </div>
        </section>

        <div className="space-y-4 border-t border-gray-400 border-dotted pt-4">
          <h3 className="text-lg font-bold">Quick Facts</h3>

          <div className="space-y-3">
            {species.threat_status && (
              <div className="flex gap-2 items-start">
                <span className="text-green-600 mt-1">
                  <MdFactCheck />
                </span>
                <div>
                  <span className="font-medium">Conservation Status: </span>
                  <span
                    className={`${getStatusColor(
                      species.threat_status
                    )} rounded-md p-1 inline-block px-2 text-sm`}
                  >
                    {species.threat_status}
                  </span>
                </div>
              </div>
            )}

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

            {species.location && (
              <div className="flex gap-2 items-start">
                <span className="text-green-600 mt-1">
                  <FaMapMarkerAlt />
                </span>
                <div>
                  <span className="font-medium">Found in: </span>
                  <span>{species.location}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <section className="border-t border-gray-400 border-dotted pt-4">
          <h2 className="text-xl font-bold mb-4">Myths & Legends</h2>
          {(() => {
            const myths = getMyths();
            return myths.length > 0 ? (
              <div className="space-y-3">
                {myths.map((content) => (
                  <div
                    key={content.id}
                    className="bg-gray-50 p-4 rounded-md shadow-sm"
                  >
                    <div className="flex justify-between items-start">
                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="font-medium mb-2">{content.title}</h3>
                        <p className="text-gray-700">{content.content}</p>
                        <div className="text-sm text-gray-500 mt-3">
                          Shared by: {content.author_name || "Anonymous"}
                          {user && content.authorId === user.id && (
                            <div className="mt-2 space-x-2">
                              <button
                                onClick={() => handleEditContent(content)}
                                className="bg-blue-600/80 text-white hover:bg-blue-800 rounded-md px-3 py-1 text-sm cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteContent(content.id)}
                                className="bg-red-700/80 text-white hover:bg-red-800 rounded-md px-3 py-1 text-sm cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Voting UI */}
                      <div className="flex flex-row items-center ml-4 pl-4">
                        {/* Upvote */}
                        <button
                          onClick={() => handleVote(content.id, "up")}
                          className={`flex items-center space-x-1 cursor-pointer p-1 rounded ${
                            content.userVoteDirection === "up"
                              ? "bg-green-100 text-green-600"
                              : "text-gray-500 hover:text-green-600"
                          }`}
                          title="Upvote this content"
                        >
                          <FaThumbsUp />
                          <span className="text-sm font-medium">
                            {content.upvotes || 0}
                          </span>
                        </button>

                        {/* Net votes */}
                        {/* <div className="text-sm font-bold my-1">
                          {(content.upvotes || 0) - (content.downvotes || 0)}
                        </div> */}

                        {/* Downvote */}
                        <button
                          onClick={() => handleVote(content.id, "down")}
                          className={`flex items-center space-x-1 cursor-pointer p-1 rounded ${
                            content.userVoteDirection === "down"
                              ? "bg-red-100 text-red-600"
                              : "text-gray-500 hover:text-red-600"
                          }`}
                          title="Downvote this content"
                        >
                          <FaThumbsDown />
                          <span className="text-sm font-medium">
                            {content.downvotes || 0}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-md text-center">
                <p className="text-gray-600 mb-2">
                  No myths or legends have been added for this species yet.
                </p>
                <button
                  onClick={() => {
                    setDefaultContentType("myth");
                    user
                      ? setShowModal(true)
                      : (window.location.href = "/login");
                  }}
                  className="text-green-600 hover:text-green-700 flex items-center gap-1 mx-auto cursor-pointer"
                >
                  <FaPlus size={14} /> Add a myth or legend
                </button>
              </div>
            );
          })()}
        </section>

        <section className="border-t border-gray-400 border-dotted pt-4">
          <h2 className="text-xl font-bold mb-4">Local Proverbs</h2>
          {(() => {
            const proverbs = getProverbs();
            return proverbs.length > 0 ? (
              <div className="space-y-3">
                {proverbs.map((content) => (
                  <div
                    key={content.id}
                    className="bg-gray-50 p-4 rounded-md shadow-sm"
                  >
                    <div className="flex justify-between items-start">
                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="font-medium mb-2">{content.title}</h3>
                        <p className="text-gray-700">{content.content}</p>
                        <div className="text-sm text-gray-500 mt-3">
                          Shared by: {content.author_name || "Anonymous"}
                          {user && content.authorId === user.id && (
                            <div className="mt-2 space-x-2">
                              <button
                                onClick={() => handleEditContent(content)}
                                className="bg-blue-600/80 text-white hover:bg-blue-800 rounded-md px-3 py-1 text-sm cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteContent(content.id)}
                                className="bg-red-700/80 text-white hover:bg-red-800 rounded-md px-3 py-1 text-sm cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Voting UI */}
                      <div className="flex flex-row items-center ml-4 pl-4">
                        {/* Upvote */}
                        <button
                          onClick={() => handleVote(content.id, "up")}
                          className={`flex items-center space-x-1 cursor-pointer p-1 rounded ${
                            content.userVoteDirection === "up"
                              ? "bg-green-100 text-green-600"
                              : "text-gray-500 hover:text-green-600"
                          }`}
                          title="Upvote this content"
                        >
                          <FaThumbsUp />
                          <span className="text-sm font-medium">
                            {content.upvotes || 0}
                          </span>
                        </button>

                        {/* Net votes */}
                        {/* <div className="text-sm font-bold my-1">
                          {(content.upvotes || 0) - (content.downvotes || 0)}
                        </div> */}

                        {/* Downvote */}
                        <button
                          onClick={() => handleVote(content.id, "down")}
                          className={`flex items-center space-x-1 cursor-pointer p-1 rounded ${
                            content.userVoteDirection === "down"
                              ? "bg-red-100 text-red-600"
                              : "text-gray-500 hover:text-red-600"
                          }`}
                          title="Downvote this content"
                        >
                          <FaThumbsDown />
                          <span className="text-sm font-medium">
                            {content.downvotes || 0}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-md text-center">
                <p className="text-gray-600 mb-2">
                  No local proverbs have been added for this species yet.
                </p>
                <button
                  onClick={() => {
                    setDefaultContentType("proverb");
                    user
                      ? setShowModal(true)
                      : (window.location.href = "/login");
                  }}
                  className="text-green-600 hover:text-green-700 flex items-center gap-1 mx-auto cursor-pointer"
                >
                  <FaPlus size={14} /> Add a proverb
                </button>
              </div>
            );
          })()}
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-400 border-dotted pt-4">
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Add Information</h3>
            <button
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition flex items-center justify-center gap-2 cursor-pointer"
              onClick={() => {
                setDefaultContentType("myth"); // Default to myth for the main button
                user ? setShowModal(true) : (window.location.href = "/login");
              }}
            >
              <FaPlus /> Add Cultural Content
            </button>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {editingContent
                  ? "Edit Cultural Content"
                  : "Add Cultural Content"}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingContent(null); // Clear editing state when closing
                }}
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
                title="Close"
              >
                <FaTimes />
              </button>
            </div>

            <p className="text-xs text-gray-500 mb-4">
              Species ID: {species?.compositeKey}
            </p>

            <AddCulturalContentForm
              speciesId={species?.compositeKey || ""}
              onSuccess={() => {
                refreshCulturalContent();
                setEditingContent(null); // Clear editing state on success
              }}
              onCancel={() => {
                setShowModal(false);
                setEditingContent(null); // Clear editing state on cancel
              }}
              defaultContentType={defaultContentType}
              editingContent={editingContent}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeciesDetails;

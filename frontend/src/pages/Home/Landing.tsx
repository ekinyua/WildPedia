import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { IoMdSearch } from "react-icons/io";
import { MdLocationOn, MdOutlinePhotoCamera } from "react-icons/md";
import { FaBookOpen } from "react-icons/fa6";
import SpeciesCard from "../../components/common/SpeciesCard/SpeciesCard";
import { Species } from "../../models";
import { getSpecies } from "../../services/speciesService";

const Landing = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const [search, setSearch] = useState(searchQuery);
  const [species, setSpecies] = useState<Species[]>([]);
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // State for mute toggle

  useEffect(() => {
    const fetchSpecies = async () => {
      setIsLoading(true);
      try {
        const response = await getSpecies(searchQuery);
        setSpecies(response.results);
        setLocation(response.location);
      } catch (error) {
        console.error("Error fetching species:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpecies();
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) {
      params.append("search", search);
    }
    window.history.pushState({}, "", `/?${params.toString()}`);
    window.dispatchEvent(new Event("popstate"));
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Hero Section with Enhanced 360° Video */}
      <div className="space-y-4">
        <div className="text-center text-gray-700">
          <p className="text-xl animate-fade-in">
            Explore African wildlife in 360°—drag to look around or use a VR
            headset!
          </p>
        </div>
        <div className="relative h-[80vh] w-full rounded-xl overflow-hidden">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.youtube-nocookie.com/embed/qGLvIN4NNZU?start=107&autoplay=1&mute=${
              isMuted ? 1 : 0
            }&loop=1&playlist=qGLvIN4NNZU&rel=0&modestbranding=1&controls=0`}
            title="African Wildlife 360° Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
          {/* <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="text-center text-white p-6">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up">
                Discover Local Biodiversity
              </h1>
              <button
                onClick={toggleMute}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
              >
                {isMuted ? "Unmute Sound" : "Mute Sound"}
              </button>
            </div>
          </div> */}
          <div className="absolute bottom-4 right-4 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
            Click to go fullscreen for the ultimate experience
          </div>
        </div>
      </div>

      {/* Search Bar Section */}
      <section className="max-w-xl mx-auto">
        <form onSubmit={handleSearchSubmit}>
          <div className="flex items-center relative">
            <input
              type="search"
              placeholder="Search for species..."
              className="border rounded-full pl-6 pr-12 py-3 w-full text-black focus:outline-none focus:ring-2 focus:ring-green-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              type="submit"
              title="Search"
              className="p-2 rounded-full bg-green-600 absolute right-2 hover:bg-green-700 transition-colors"
            >
              <IoMdSearch className="text-white text-xl" />
            </button>
          </div>
        </form>
      </section>

      {/* Species Near You Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            {searchQuery ? "Search Results" : "Species Near You"}
          </h1>
          <div className="flex items-center text-green-600">
            <MdLocationOn className="mr-1" size={20} />
            <span>{location}</span>
          </div>
        </div>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading species data...</p>
          </div>
        ) : species.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {species.map((s) => (
              <SpeciesCard key={s.key} species={s} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">
              No species found{searchQuery ? ` for "${searchQuery}"` : ""}.
            </p>
          </div>
        )}
      </section>

      {/* How It Works Section */}
      <section className="bg-green-50 rounded-xl p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center">How WildPedia Works</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm relative pt-12">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-green-600 p-3 rounded-full text-white">
              <MdOutlinePhotoCamera size={24} />
            </div>
            <h3 className="font-bold text-xl mb-2 text-center">Take a Photo</h3>
            <p className="text-gray-600 text-center">
              Upload or capture a photo of the species you want to identify
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm relative pt-12">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-green-600 p-3 rounded-full text-white">
              <IoMdSearch size={24} />
            </div>
            <h3 className="font-bold text-xl mb-2 text-center">
              Get Instant Results
            </h3>
            <p className="text-gray-600 text-center">
              Our AI technology identifies species and provides detailed
              information
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm relative pt-12">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-green-600 p-3 rounded-full text-white">
              <FaBookOpen size={24} />
            </div>
            <h3 className="font-bold text-xl mb-2 text-center">
              Learn & Share
            </h3>
            <p className="text-gray-600 text-center">
              Access comprehensive information and share your discoveries
            </p>
          </div>
        </div>
      </section>

      {/* Why Biodiversity Matters Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-xl shadow-sm">
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Why Biodiversity Matters</h1>
          <p className="text-gray-700">
            Understanding and protecting biodiversity is crucial for maintaining
            healthy ecosystems and ensuring a sustainable future for our planet.
            Every species plays a vital role in the delicate balance of nature.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-600 text-3xl font-bold">1500+</p>
              <p className="text-gray-700">Species Documented</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-600 text-3xl font-bold">50+</p>
              <p className="text-gray-700">Conservation Areas</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-600 text-3xl font-bold">10K+</p>
              <p className="text-gray-700">Community Contributors</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-600 text-3xl font-bold">20+</p>
              <p className="text-gray-700">Partner Organizations</p>
            </div>
          </div>
        </div>
        <div>
          <img
            src="/biodiversity.jpg"
            alt="Biodiversity"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </section>
    </div>
  );
};

export default Landing;

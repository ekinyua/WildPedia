import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { IoMdSearch } from "react-icons/io";
import { MdLocationOn, MdOutlinePhotoCamera } from "react-icons/md";
import { FaArrowLeft, FaArrowRight, FaBookOpen } from "react-icons/fa6";
import SpeciesCard from "../../components/common/SpeciesCard/SpeciesCard";
import { Species } from "../../models";
import { getSpecies, recordSearch } from "../../services/speciesService";
import Header from "../../components/layouts/Header";
import Footer from "../../components/layouts/Footer";
import SketchfabEmbed from "../../components/common/SketchFabEmbed/SketchfabEmbed";

const Landing = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const resultsRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState(searchQuery);
  const [species, setSpecies] = useState<Species[]>([]);
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const speciesSectionRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchSpecies = async () => {
      setIsLoading(true);
      try {
        const offset = (currentPage - 1) * itemsPerPage;
        const response = await getSpecies(searchQuery, itemsPerPage, offset);

        setSpecies(response.results);
        setLocation(response.location);

        if (searchQuery) {
          recordSearch(searchQuery, response.results.length);
        }

        // Update pagination state
        if (response.pagination) {
          setTotalPages(Math.ceil(response.pagination.total / itemsPerPage));
          setHasMore(response.pagination.hasMore);
        }

        // Scroll to the top of the species section after data loads
        if (speciesSectionRef.current && searchQuery) {
          speciesSectionRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      } catch (error) {
        console.error("Error fetching species:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpecies();
  }, [searchQuery, currentPage]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search) {
      const params = new URLSearchParams();
      params.append("search", search);
      window.history.pushState({}, "", `/?${params.toString()}`);
      window.dispatchEvent(new Event("popstate"));
      setSearch("");
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="">
      <Header />

      <div className="mb-2">
        <div className="relative h-[90vh] w-full rounded-xl overflow-hidden mb-4">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.youtube-nocookie.com/embed/qGLvIN4NNZU?start=107&autoplay=1&mute=${
              isMuted ? 1 : 0
            }&loop=1&playlist=qGLvIN4NNZU&rel=0&modestbranding=1&controls=0&vq=hd1080`}
            title="African Wildlife 360° Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>

          <div className="absolute bottom-4 left-4 text-gray-300 text-sm bg-black/60 bg-opacity-50 px-2 py-1 rounded-md">
            Drag to look around or use a VR headset!
          </div>
        </div>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-xl shadow-sm">
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Why Biodiversity Matters</h1>
          <p className="text-gray-700">
            Understanding and protecting biodiversity is crucial for maintaining
            healthy ecosystems and ensuring a sustainable future for our planet.
            Every species plays a vital role in the delicate balance of nature.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg shadow-sm">
              <p className="text-green-600 text-3xl font-bold">1M+</p>
              <p className="text-gray-700">
                Species Facing Extinction Globally
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg shadow-sm">
              <p className="text-green-600 text-3xl font-bold">76%</p>
              <p className="text-gray-700">
                Decline in African Wildlife Since 1970
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg shadow-sm">
              <p className="text-green-600 text-3xl font-bold">$2.7T</p>
              <p className="text-gray-700">
                Potential Annual GDP Loss Due to Biodiversity Decline by 2030
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg shadow-sm">
              <p className="text-green-600 text-3xl font-bold">12K</p>
              <p className="text-gray-700">
                Hectares of Kenyan Forest Lost Annually
              </p>
            </div>
          </div>
          <div className="border-1 border-dotted border-gray-200 p-4 rounded-lg space-y-4 shadow-md">
            <h1 className="text-2xl font-bold ">Why Wildpedia</h1>
            <p className="text-gray-700 ">
              Preserves indigenous knowledge alongside scientific data
            </p>
            <p className="text-gray-700">
              Creates accessible biodiversity education
            </p>
            <p className="text-gray-700">
              Fosters community-driven conservation awareness
            </p>
          </div>
        </div>
        <SketchfabEmbed />
      </section>

      <section className="bg-green-50 rounded-xl p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center">How WildPedia Works</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm relative pt-12">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-green-600 p-3 rounded-full text-white">
              <MdOutlinePhotoCamera size={24} />
            </div>
            <h3 className="font-bold text-xl mb-2 text-center">
              SNAP & IDENTIFY
            </h3>
            <p className="text-gray-600 text-center">
              Capture any plant or animal with your camera for instant species
              identification.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm relative pt-12">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-green-600 p-3 rounded-full text-white">
              <IoMdSearch size={24} />
            </div>
            <h3 className="font-bold text-xl mb-2 text-center">
              DISCOVER STORIES
            </h3>
            <p className="text-gray-600 text-center">
              Uncover cultural significance and ecological roles of species in
              your region.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm relative pt-12">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-green-600 p-3 rounded-full text-white">
              <FaBookOpen size={24} />
            </div>
            <h3 className="font-bold text-xl mb-2 text-center">
              LEARN AND CONTRIBUTE
            </h3>
            <p className="text-gray-600 text-center">
              Access knowledge and share your insights to our growing database.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-xl mx-auto mt-6" ref={resultsRef}>
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
              className="p-2 rounded-full bg-green-600 absolute right-2 hover:bg-green-700 transition-colors cursor-pointer"
            >
              <IoMdSearch className="text-white text-xl" />
            </button>
          </div>
        </form>
      </section>

      <section className="space-y-6" ref={speciesSectionRef}>
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
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {species.map((s) => (
                <SpeciesCard key={s.key} species={s} />
              ))}
            </div>
            <div className="flex justify-center mt-6">
              {totalPages > 1 && (
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      const currentPosition = window.scrollY;
                      setCurrentPage((p) => p + -1);
                      window.scrollTo(0, currentPosition);
                    }}
                    disabled={currentPage === 1}
                    className="text-green-700 disabled:opacity-50 cursor-pointer"
                  >
                    <FaArrowLeft />
                  </button>

                  <span className="px-4 py-2">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      const currentPosition = window.scrollY;
                      setCurrentPage((p) => p + 1);
                      window.scrollTo(0, currentPosition);
                    }}
                    disabled={!hasMore}
                    className="text-green-700 disabled:opacity-50 cursor-pointer"
                  >
                    <FaArrowRight />
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">
              No species found{searchQuery ? ` for "${searchQuery}"` : ""}.
            </p>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Landing;

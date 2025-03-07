import { useState, useEffect } from "react";
import { IoChevronDownSharp } from "react-icons/io5";
import OrganizationCard from "../../components/common/OrganizationCard/OrganizationCard";
import { Organization } from "../../models";
import { mockOrganizations } from "../../mock/mockData";
import Header from "../../components/layouts/Header";
import Footer from "../../components/layouts/Footer";

const Organizations = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [filteredOrganizations, setFilteredOrganizations] = useState<
    Organization[]
  >([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState(4);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrganizations = async () => {
      setIsLoading(true);
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        setOrganizations(mockOrganizations);
      } catch (error) {
        console.error("Error fetching organizations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  useEffect(() => {
    if (selectedCountry === "all") {
      setFilteredOrganizations(organizations);
    } else {
      setFilteredOrganizations(
        organizations.filter(
          (org) => org.country.toLowerCase() === selectedCountry.toLowerCase()
        )
      );
    }
  }, [selectedCountry, organizations]);

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setVisibleCount(4);
  };

  const loadMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  return (
    <div className="max-w-6xl mx-auto py-2">
      <Header />
      <div className="space-y-8">
        <div className="bg-blue-50 p-8 rounded-xl mb-8">
          <h1 className="text-3xl font-bold mb-4">
            Conservation Organizations
          </h1>
          <p className="text-gray-700 mb-6 max-w-3xl">
            Discover organizations dedicated to protecting and preserving
            biodiversity in East Africa. These organizations work tirelessly to
            conserve wildlife, protect habitats, and promote sustainable
            practices.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleCountryChange("all")}
              className={`rounded-full ${
                selectedCountry === "all"
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-800"
              } px-6 py-2 focus:outline-none transition-colors`}
            >
              All Organizations
            </button>
            <button
              onClick={() => handleCountryChange("kenya")}
              className={`rounded-full ${
                selectedCountry === "kenya"
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-800"
              } px-6 py-2 focus:outline-none transition-colors`}
            >
              Kenya
            </button>
            <button
              onClick={() => handleCountryChange("rwanda")}
              className={`rounded-full ${
                selectedCountry === "rwanda"
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-800"
              } px-6 py-2 focus:outline-none transition-colors`}
            >
              Rwanda
            </button>
            <button
              onClick={() => handleCountryChange("uganda")}
              className={`rounded-full ${
                selectedCountry === "uganda"
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-800"
              } px-6 py-2 focus:outline-none transition-colors`}
            >
              Uganda
            </button>
            <button
              onClick={() => handleCountryChange("tanzania")}
              className={`rounded-full ${
                selectedCountry === "tanzania"
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-800"
              } px-6 py-2 focus:outline-none transition-colors`}
            >
              Tanzania
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : filteredOrganizations.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrganizations
                .slice(0, visibleCount)
                .map((organization) => (
                  <OrganizationCard
                    key={organization.id}
                    organization={organization}
                  />
                ))}
            </div>

            {visibleCount < filteredOrganizations.length && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={loadMore}
                  className="flex items-center gap-2 bg-white text-green-600 border border-green-600 px-6 py-3 rounded-lg hover:bg-green-50 transition-colors"
                >
                  Load More Organizations
                  <IoChevronDownSharp />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600">
              No organizations found for the selected country.
            </p>
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
};

export default Organizations;

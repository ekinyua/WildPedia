import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { GiEgyptianBird, GiElephant, GiLindenLeaf } from "react-icons/gi";
import { PiBugFill } from "react-icons/pi";
import { VscSnake } from "react-icons/vsc";
import { FaFish } from "react-icons/fa";
import { getLearningCategories } from "../../services/learnService";

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const Learning = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories(selectedRegion);
  }, [selectedRegion]);

  const fetchCategories = async (region: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getLearningCategories(region || undefined);
      setCategories(data);
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      setError("Failed to load learning categories. Please try again later.");
      // Keep any previously loaded categories in case of error
      if (categories.length === 0) {
        // If we don't have any categories yet, set some defaults to ensure the UI renders
        setCategories([
          {
            id: "mammals",
            name: "Mammals",
            description: "Learn about the diverse mammals of East Africa.",
            icon: "GiElephant",
          },
          {
            id: "birds",
            name: "Birds",
            description: "Discover the colorful world of East African birds.",
            icon: "GiEgyptianBird",
          },
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const region = e.target.value;
    setSelectedRegion(region);
  };

  // Function to render the correct icon based on icon name
  const renderIcon = (iconName: string, className: string = "text-2xl") => {
    switch (iconName) {
      case "GiElephant":
        return <GiElephant className={className} />;
      case "GiEgyptianBird":
        return <GiEgyptianBird className={className} />;
      case "FaFish":
        return <FaFish className={className} />;
      case "GiLindenLeaf":
        return <GiLindenLeaf className={className} />;
      case "PiBugFill":
        return <PiBugFill className={className} />;
      case "VscSnake":
        return <VscSnake className={className} />;
      default:
        return <GiElephant className={className} />;
    }
  };

  // Function to get background color based on category
  const getCategoryBgColor = (categoryId: string) => {
    switch (categoryId) {
      case "mammals":
        return "bg-green-100/20";
      case "birds":
        return "bg-green-100/20";
      case "marine":
        return "bg-green-100/20";
      case "plants":
        return "bg-green-100/20";
      case "insects":
        return "bg-green-100/20";
      case "reptiles":
        return "bg-green-100/20";
      default:
        return "bg-green-100/20";
    }
  };

  return (
    <div className="max-w-7xl mx-auto rounded-lg shadow-md overflow-hidden p-6">
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
        <Link
          to="/"
          className="flex items-center space-x-2 text-green-600 font-medium hover:text-green-700"
        >
          <FaArrowLeft /> <span>Back to Home</span>
        </Link>
        <div className="flex space-x-4">
          <button
            className={`${
              selectedLanguage === "en"
                ? "text-green-600 font-bold"
                : "text-gray-600"
            } hover:text-green-600`}
            onClick={() => setSelectedLanguage("en")}
          >
            EN
          </button>
          <button
            className={`${
              selectedLanguage === "sw"
                ? "text-green-600 font-bold"
                : "text-gray-600"
            } hover:text-green-600`}
            onClick={() => setSelectedLanguage("sw")}
          >
            SW
          </button>
          <button
            className={`${
              selectedLanguage === "rw"
                ? "text-green-600 font-bold"
                : "text-gray-600"
            } hover:text-green-600`}
            onClick={() => setSelectedLanguage("rw")}
          >
            KIN
          </button>
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-6">Learning Center</h1>
      <p className="mb-6 text-gray-600">
        Explore our educational resources about East African biodiversity.
        Select a category below to learn more and test your knowledge with our
        quizzes.
      </p>

      <div className="mb-8">
        <select
          title="Region"
          className="border rounded p-2 bg-white w-60 font-medium focus:outline-none focus:ring-2 focus:ring-green-500"
          value={selectedRegion}
          onChange={handleRegionChange}
        >
          <option value="">All Regions</option>
          <option value="Kenya">Kenya</option>
          <option value="Rwanda">Rwanda</option>
          <option value="Uganda">Uganda</option>
          <option value="Tanzania">Tanzania</option>
        </select>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`${getCategoryBgColor(
                category.id
              )} p-6 rounded-lg shadow-sm transition-transform hover:shadow-md hover:-translate-y-1`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <span className="rounded-full p-2 bg-blue-100">
                  {renderIcon(category.icon)}
                </span>
                <h3 className="font-semibold text-lg">{category.name}</h3>
              </div>
              <p className="text-gray-700 mb-4">{category.description}</p>
              <Link
                to={`/learn/${category.id}${
                  selectedRegion
                    ? `?region=${encodeURIComponent(selectedRegion)}`
                    : ""
                }`}
                className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
              >
                Start Quiz
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center bg-gray-50 p-6 rounded-lg">
          <p className="text-gray-700">
            No learning categories available for the selected region.
          </p>
          <button
            onClick={() => setSelectedRegion("")}
            className="mt-4 text-green-600 hover:text-green-700 underline"
          >
            View all regions
          </button>
        </div>
      )}
    </div>
  );
};

export default Learning;

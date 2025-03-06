// src/pages/NotFound.tsx
import { Link } from "react-router-dom";
import { FaHome, FaSearch } from "react-icons/fa";

const NotFound = () => {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4 text-center">
      <div className="mb-8">
        <div className="inline-block p-6 rounded-full bg-red-100 mb-6">
          <span className="text-red-600 text-6xl font-bold">404</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="text-lg text-gray-600 max-w-lg mx-auto">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
        <Link
          to="/"
          className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
        >
          <FaHome /> Go to Homepage
        </Link>
        <Link
          to="/learn"
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaSearch /> Explore Learning Center
        </Link>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg inline-block">
        <h2 className="text-xl font-semibold mb-4">
          You might be interested in
        </h2>
        <ul className="text-left space-y-2">
          <li>
            <Link
              to="/"
              className="text-green-600 hover:text-green-700 flex items-center gap-2"
            >
              <span>→</span> Discover Local Biodiversity
            </Link>
          </li>
          <li>
            <Link
              to="/identify"
              className="text-green-600 hover:text-green-700 flex items-center gap-2"
            >
              <span>→</span> Identify a Species
            </Link>
          </li>
          <li>
            <Link
              to="/organizations"
              className="text-green-600 hover:text-green-700 flex items-center gap-2"
            >
              <span>→</span> Conservation Organizations
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NotFound;

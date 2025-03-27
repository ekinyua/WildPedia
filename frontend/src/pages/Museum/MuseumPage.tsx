import React from "react";
import { FaExternalLinkAlt } from "react-icons/fa";

const MuseumLinks = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mt-6">
      <h3 className="font-semibold text-lg mb-3">Virtual Museum Experiences</h3>
      <p className="text-gray-700 mb-4">
        Explore these virtual museums to enhance your biodiversity knowledge.
      </p>

      <div className="space-y-3">
        <a
          href="https://naturalhistory2.si.edu/vt3/NMNH/?startscene=22&startactions=lookat(-140.98,-3.82,116,0,0);"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-3 bg-green-50 rounded-md hover:bg-green-100 transition-colors"
        >
          <span className="font-medium">
            Smithsonian Natural History Museum
          </span>
          <FaExternalLinkAlt className="text-green-600" />
        </a>

        <a
          href="https://g.co/arts/uJ7uGRGSLdYkH1Lv8"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-3 bg-green-50 rounded-md hover:bg-green-100 transition-colors"
        >
          <span className="font-medium">
            Google Arts & Culture - Natural History
          </span>
          <FaExternalLinkAlt className="text-green-600" />
        </a>
      </div>
    </div>
  );
};

export default MuseumLinks;

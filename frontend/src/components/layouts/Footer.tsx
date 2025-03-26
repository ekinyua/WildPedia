import { Link } from "react-router-dom";
import {
  FaLeaf,
  FaGithub,
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaHeart,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-green-800/90 text-white mt-8 pt-4 rounded-md">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <img
                src="/wildpedia_logo.png"
                className="text-white h-15 p-0 m-0"
              />
            </Link>
            <p className="text-green-200 text-sm mb-4">
              Exploring and preserving East African biodiversity through
              community knowledge and scientific facts.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-green-200 hover:text-white transition-colors"
              >
                <FaTwitter />
              </a>
              <a
                href="#"
                className="text-green-200 hover:text-white transition-colors"
              >
                <FaFacebook />
              </a>
              <a
                href="#"
                className="text-green-200 hover:text-white transition-colors"
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                className="text-green-200 hover:text-white transition-colors"
              >
                <FaGithub />
              </a>
            </div>
          </div>

          {/* Quick Links with extended description */}
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="mb-4">
                  <Link
                    to="/"
                    className="text-green-100 font-bold hover:text-white transition-colors block mb-1"
                  >
                    Home
                  </Link>
                  <p className="text-green-100/80 text-xs">
                    Discover species near you and explore biodiversity
                  </p>
                </div>
                <div className="mb-4">
                  <Link
                    to="/learn"
                    className="text-green-100 font-bold hover:text-white transition-colors block mb-1"
                  >
                    Learn
                  </Link>
                  <p className="text-green-100/80 text-xs">
                    Access educational resources and take quizzes
                  </p>
                </div>
              </div>
              <div>
                <div className="mb-4">
                  <Link
                    to="/identify"
                    className="text-green-100 font-bold hover:text-white transition-colors block mb-1"
                  >
                    Identify Species
                  </Link>
                  <p className="text-green-100/80 text-xs">
                    Upload images to identify plants and animals
                  </p>
                </div>
                <div className="mb-4">
                  <Link
                    to="/organizations"
                    className="text-green-100 font-bold hover:text-white transition-colors block mb-1"
                  >
                    Organizations
                  </Link>
                  <p className="text-green-100/80 text-xss">
                    Connect with conservation groups in East Africa
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Statement Banner */}
        <div className="border-t border-green-700 text-center">
          <p className="mb-4 text-green-100 flex items-center justify-center flex-wrap gap-2">
            <span>
              Our mission is to protect biodiversity through education and
              community engagement
            </span>
            <FaHeart className="text-red-400" />
          </p>
          <p className="text-green-300 text-sm">
            &copy; {new Date().getFullYear()} WildPedia. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

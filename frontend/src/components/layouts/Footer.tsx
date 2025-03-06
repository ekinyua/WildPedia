import { Link } from "react-router-dom";
import {
  FaLeaf,
  FaGithub,
  FaTwitter,
  FaFacebook,
  FaInstagram,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-green-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <FaLeaf className="text-2xl" />
              <span className="text-xl font-bold">WildPedia</span>
            </Link>
            <p className="text-green-200 text-sm mb-4">
              Exploring and preserving East African biodiversity through
              community knowledge and scientific facts.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-green-200 hover:text-white">
                <FaTwitter />
              </a>
              <a href="#" className="text-green-200 hover:text-white">
                <FaFacebook />
              </a>
              <a href="#" className="text-green-200 hover:text-white">
                <FaInstagram />
              </a>
              <a href="#" className="text-green-200 hover:text-white">
                <FaGithub />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-green-200 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/learn" className="text-green-200 hover:text-white">
                  Learn
                </Link>
              </li>
              <li>
                <Link
                  to="/identify"
                  className="text-green-200 hover:text-white"
                >
                  Identify Species
                </Link>
              </li>
              <li>
                <Link
                  to="/organizations"
                  className="text-green-200 hover:text-white"
                >
                  Organizations
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-medium mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-green-200 hover:text-white">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-green-200 hover:text-white">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-green-200 hover:text-white">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-green-200 hover:text-white">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-medium mb-4">Stay Updated</h3>
            <p className="text-green-200 text-sm mb-4">
              Subscribe to our newsletter for the latest biodiversity news and
              updates.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 w-full rounded-l text-gray-900 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-r hover:bg-green-700"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-green-700 mt-8 pt-6 text-center">
          <p className="text-green-200 text-sm">
            &copy; {new Date().getFullYear()} WildPedia. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

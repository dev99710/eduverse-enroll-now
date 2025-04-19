
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-eduBlue-700 text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">EduVerse</h3>
            <p className="text-gray-300">
              Connecting teachers and students through quality online education.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-gray-300 hover:text-white transition">
                  Courses
                </Link>
              </li>
              <li>
                <Link to="/auth/register" className="text-gray-300 hover:text-white transition">
                  Become a Teacher
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <address className="not-italic text-gray-300">
              <p>Email: contact@eduverse.com</p>
              <p>Phone: (123) 456-7890</p>
            </address>
          </div>
        </div>
        <div className="border-t border-eduBlue-600 mt-8 pt-6 text-center text-gray-300 text-sm">
          <p>© {new Date().getFullYear()} EduVerse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

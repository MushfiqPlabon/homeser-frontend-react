// NotFound.jsx
// This page component is displayed when a user navigates to a URL that does not match
// any defined routes in the application, indicating that the page was not found (404 error).

import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md text-center">
        <img
          src="/images/error_page_illustration.png"
          alt="Page Not Found"
          className="mx-auto h-64 w-auto mb-8 object-contain"
        />
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
          404 - Page Not Found
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Oops! The page you're looking for doesn't exist.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

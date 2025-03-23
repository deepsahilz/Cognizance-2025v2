import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="bg-white/10 backdrop-blur-md p-10 rounded-3xl shadow-xl flex flex-col items-center transition-all duration-300 hover:scale-105 hover:shadow-pink-500/50">
        <h1 className="text-9xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-pulse">404</h1>
        <p className="text-xl mb-6 text-gray-300">Page Not Found 😵‍💫</p>

        <Link
          to="/"
          className="relative inline-block px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-lg shadow-lg transition-all duration-300 hover:shadow-pink-500/50 hover:scale-110"
        >
          <span className="relative z-10">🏠 Go Home</span>
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 blur opacity-50 transition duration-300 hover:opacity-70"></span>
        </Link>

        <p className="mt-8 text-sm text-gray-400 hover:text-gray-200 transition duration-300">
          Looks like you're lost in the void 🌌✨
        </p>
      </div>
    </div>
  );
}

export default NotFound;

import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true;

const Home = () => {
  const [user, setUser] = useState({ name: "", email: "", id: "" });
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:3001/home");
        if (response.data.message === "Welcome to Home") {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error("Authorization error:", error);
        setAuthError("Unauthorized. Please log in.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3001/logout");
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-100 flex flex-col items-center justify-center relative px-6">
      
      {/* Logout Button - Moved to Left */}
      <button
        onClick={handleLogout}
        className="absolute top-6 left-6 bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white font-semibold px-5 py-2 rounded-full shadow-lg backdrop-blur-md bg-opacity-70 hover:scale-105 transition-all duration-300 ease-in-out flex items-center gap-2"
      >
        Logout
      </button>


      {/* Card */}
      <div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md text-center"
      >
        {loading ? (
          <p className="text-gray-600 text-lg">Loading...</p>
        ) : authError ? (
          <p className="text-red-600 text-lg font-semibold"> {authError}</p>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-green-700 mb-4 flex justify-center items-center gap-2">
              Welcome, {user.name}!
            </h2>
            <div className="text-left space-y-3 text-gray-700 text-lg mt-4">
              <p className="flex items-center gap-2">
                <span><strong>Name:</strong> {user.name}</span>
              </p>
              <p className="flex items-center gap-2">
                <span><strong>Email:</strong> {user.email}</span>
              </p>
              <p className="flex items-center gap-2">
                <span><strong>ID:</strong> {user.id}</span>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
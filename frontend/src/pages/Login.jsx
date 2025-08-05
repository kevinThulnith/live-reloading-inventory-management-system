import LoadingIndicator from "../components/LoadingIndicator";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { useNavigate, Link } from "react-router-dom";
import { IoMdLogIn } from "react-icons/io";
import { motion } from "framer-motion";
import { useState } from "react";
import api from "../api";

// !Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.1,
    },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    api
      .post("api/token/", formData)
      .then((res) => {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/");
        window.location.reload();
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          const errorData = error.response.data;
          const errorMessages = Object.values(errorData).flat().join(" ");
          alert(errorMessages);
        } else alert("An error occurred. Please try again later.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <motion.div
      className="form-container w-[380px] bg-slate-100 rounded-lg shadow-md p-6 mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h2
        className="text-5xl font-semibold text-center text-orange-700 pt-3"
        variants={sectionVariants}
      >
        Login
        <IoMdLogIn className="inline-block text-5x ml-1" />
      </motion.h2>

      <form className="mt-10" onSubmit={handleSubmit}>
        {["username", "password"].map((field) => (
          <motion.div key={field} className="mb-4" variants={sectionVariants}>
            <label className="block text-1xl font-medium text-orange-800 capitalize">
              {field}
            </label>
            <input
              type={field === "password" ? "password" : "text"}
              id={field}
              value={formData[field]}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder={`Enter your ${field}`}
              required
            />
          </motion.div>
        ))}

        <motion.button
          type="submit"
          className="w-full mt-2 px-4 py-2 text-slate-100 bg-orange-500 rounded-lg hover:bg-orange-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
          variants={sectionVariants}
        >
          {loading ? "Logging in..." : "Login"}
        </motion.button>
      </form>

      {loading && <LoadingIndicator />}

      <motion.p
        className="mt-5 text-1xl text-center text-gray-600"
        variants={sectionVariants}
      >
        Don&apos;t have an account?{" "}
        <Link
          to="/register"
          className="text-orange-500 font-medium hover:text-orange-800 transition-colors"
        >
          Signup
        </Link>
      </motion.p>
    </motion.div>
  );
}

export default Login;

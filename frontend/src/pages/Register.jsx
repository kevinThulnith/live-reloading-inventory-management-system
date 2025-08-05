import LoadingIndicator from "../components/LoadingIndicator";
import { useNavigate, Link } from "react-router-dom";
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

// !Form field configuration
const formFields = [
  { id: "username", type: "text", label: "Username" },
  { id: "email", type: "email", label: "Email" },
  { id: "password", type: "password", label: "Password" },
];

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
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
      .post("api/user/register/", formData)
      .then(() => navigate("/login"))
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
        className="text-5xl font-semibold text-center text-orange-600 pt-3"
        variants={sectionVariants}
      >
        Register
      </motion.h2>

      <form onSubmit={handleSubmit} className="mt-10">
        {formFields.map(({ id, type, label }) => (
          <motion.div key={id} className="mb-4" variants={sectionVariants}>
            <label className="block text-1xl font-medium text-orange-800">
              {label}
            </label>
            <input
              type={type}
              id={id}
              value={formData[id]}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder={`Enter your ${id}`}
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
          {loading ? "Registering..." : "Register"}
        </motion.button>
      </form>

      {loading && <LoadingIndicator />}

      <motion.p
        className="mt-5 text-1xl text-center text-gray-600"
        variants={sectionVariants}
      >
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-orange-500 font-medium hover:text-orange-800 transition-colors"
        >
          Login
        </Link>
      </motion.p>
    </motion.div>
  );
}

export default Register;

import LoadingIndicator from "../components/LoadingIndicator";
import animations from "../components/animation";
import { IoBookmarks } from "react-icons/io5";
import { useState, useEffect } from "react"; // Removed useMemo as it's not needed here
import { IoSearch } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import { motion } from "framer-motion";
import api from "../api";

function Home() {
  const [userInfo, setUserInfo] = useState({ username: "", email: "" });
  const [products, setProducts] = useState([]); // Master list of all products
  const [filteredProducts, setFilteredProducts] = useState([]); // List to be displayed
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true); // Start with loading true
  const [wsStatus, setWsStatus] = useState("Connecting..."); // State for WebSocket status

  // --- Step 1: Centralized data fetching and WebSocket connection ---
  useEffect(() => {
    // This function runs only once when the component mounts

    // --- Fetch initial data ---
    const fetchInitialData = async () => {
      try {
        const userRes = await api.get("api/user/");
        setUserInfo(userRes.data);

        const productsRes = await api.get("api/products/");
        setProducts(productsRes.data);
        setFilteredProducts(productsRes.data); // Initially, filtered is all products
      } catch (error) {
        alert(
          "Failed to fetch initial data. Please check your connection and try again."
        );
        console.error("Initial data fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();

    // --- Establish WebSocket connection ---

    // 1. Get the access token from localStorage
    const token = localStorage.getItem("access");

    // 2. If no token, don't even try to connect.
    if (!token) {
      setWsStatus("No Auth Token");
      console.error(
        "Authentication token not found. Cannot connect to WebSocket."
      );
      return;
    }

    // 3. Construct the WebSocket URL with the token as a query parameter
    const socketUrl = `${
      import.meta.env.VITE_WS_URL
    }/ws/products/?token=${token}`;
    const socket = new WebSocket(socketUrl);

    socket.onopen = () => {
      console.log("WebSocket connected!");
      setWsStatus("Connected");
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      // Ignore the initial connection message from being added to the product list
      if (message.type === "connection_established") {
        console.log("Server message:", message.message);
        return;
      }

      console.log("WebSocket message received:", message);

      if (message.action) {
        // Update the master `products` state. The filtering `useEffect` below
        // will automatically handle updating the view.
        setProducts((prevProducts) => {
          switch (message.action) {
            case "create":
              // Add the new product to the beginning of the master list
              return [message.data, ...prevProducts];
            case "update":
              // Find and update the product in the master list
              return prevProducts.map((p) =>
                p.id === message.data.id ? message.data : p
              );
            case "delete":
              // Filter out the deleted product from the master list
              return prevProducts.filter((p) => p.id !== message.data.id);
            default:
              return prevProducts;
          }
        });
      }
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected.");
      setWsStatus("Disconnected");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setWsStatus("Error");
    };

    // --- Cleanup function ---
    // This will be called when the component unmounts to prevent memory leaks
    return () => {
      // Check if the socket exists and is in a connecting or open state before closing
      if (
        socket &&
        (socket.readyState === WebSocket.CONNECTING ||
          socket.readyState === WebSocket.OPEN)
      ) {
        socket.close();
      }
    };
  }, []); // The empty dependency array `[]` ensures this effect runs only once.

  // --- Step 2: Keep the filtering logic as is ---
  // This effect reacts to changes in `searchTerm` or the master `products` list
  useEffect(() => {
    let filtered;
    if (searchTerm === "") {
      filtered = products;
    } else {
      const lowercasedTerm = searchTerm.toLowerCase();
      filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(lowercasedTerm) ||
          product.description.toLowerCase().includes(lowercasedTerm) ||
          product.category.toLowerCase().includes(lowercasedTerm)
      );
    }
    setFilteredProducts(filtered);
  }, [searchTerm, products]);
  return (
    <div>
      <div className="w-full bg-slate-100 rounded-lg shadow-md p-4 flex justify-between items-center">
        <div>
          <h2 className="text-lg capitalize text-gray-600 ml-4">
            Welcome back, {userInfo.username}!
          </h2>
          {/* Live Status Indicator */}
          <div className="flex items-center gap-2 text-sm text-gray-500 ml-4">
            <span
              className={`h-2.5 w-2.5 rounded-full animate-pulse ${
                wsStatus === "Connected" ? "bg-green-500" : "bg-red-500"
              }`}
            ></span>
            <span>Live Feed: {wsStatus}</span>
          </div>
        </div>
        <a
          href="/add-product"
          className="bg-orange-500 text-white text-lg py-2 px-4 rounded hover:bg-gray-600 outline-none ease-in duration-100"
        >
          <FaPlus className="inline mr-2" />
          Add Product
        </a>
      </div>
      <motion.div
        id="container"
        initial="hidden"
        animate="visible"
        variants={animations.container}
        className="bg-slate-100 mt-4 rounded-lg shadow-md sm:p-6 p-4 container mx-auto ss:w-min w-[360px]"
      >
        <div className="flex items-center justify-between mt-2">
          <motion.h1
            variants={animations.title}
            className="text-3xl font-semibold flex items-center gap-2 text-orange-500"
          >
            <IoBookmarks style={{ fontSize: "26px" }} />
            Products
          </motion.h1>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border rounded-lg outline-none bg-slate-200 w-40 md:w-64 focus:w-52 md:focus:w-72 ease-linear duration-150 text-black pr-10"
              placeholder="Search..."
            />
            <IoSearch
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
              style={{ fontSize: "22px" }}
            />
          </div>
        </div>
        <motion.div style={{ overflow: "auto" }} values={animations.item}>
          <motion.div
            className="bg-slate-100 mt-10 rounded-xl mx-auto w-[720px]"
            variants={animations.item}
          >
            <div className="bg-orange-600 w-full h-[45px] rounded-t-xl flex text-white text-center">
              <div className="flex-[0.5] pt-3 border-r-2 border-white font-semibold">
                Id
              </div>
              <div className="flex-1 pt-3 border-r-2 border-white font-semibold">
                Name
              </div>
              <div className="flex-1 pt-3 border-r-2 border-white font-semibold">
                Category
              </div>
              <div className="flex-1 pt-3 border-r-2 border-white font-semibold">
                Price
              </div>
              <div className="flex-[0.7] pt-3 border-r-2 border-white font-semibold">
                Quantity
              </div>
              <div className="flex-[0.8] pt-3 font-semibold">Status</div>
            </div>
            <div className="w-full h-[420px] rounded-b-xl overflow-x-auto bg-gray-100">
              {filteredProducts.map((product, index) => (
                <motion.div
                  className={`${
                    index !== 0 ? "border-t-2 border-gray-300 " : ""
                  } flex columns-4 h-[45px] w-full font-medium indent-2`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex-[0.5] pt-2 border-r-2 border-gray-300 text-center">
                    {product.id}
                  </div>
                  <div className="flex-1 pt-2 border-r-2 border-gray-300 font-medium truncate w-[15ch] overflow-hidden whitespace-nowrap">
                    {product.name}
                  </div>
                  <div className="flex-1 pt-2 border-r-2 border-gray-300">
                    {product.category.charAt(0).toUpperCase() +
                      product.category.slice(1)}
                  </div>
                  <div className="flex-1 pt-2 border-r-2 border-gray-300 text-center">
                    {product.price}
                  </div>
                  <div className="flex-[0.7] pt-2 border-r-2 border-gray-300 text-center">
                    {product.quantity}
                  </div>
                  <div className="flex-[0.8] text-center font-medium mt-2">
                    <span
                      className={`px-2 py-1 text-sm font-semibold rounded-full ${
                        product.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </motion.div>
              ))}
              {filteredProducts.length === 0 && !loading && (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    {searchTerm ? (
                      <>
                        <p className="text-xl font-medium">No products found</p>
                        <p className="text-sm mt-2">
                          Try adjusting your search terms
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-xl font-medium">No products found</p>
                        <p className="text-sm mt-2">
                          Add your first product to get started!
                        </p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Home;

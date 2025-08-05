import LoadingIndicator from "../components/LoadingIndicator";
import animations from "../components/animation";
import { IoBookmarks } from "react-icons/io5";
import { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { motion } from "framer-motion";
import api from "../api";

function MyProducts() {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  // TODO: Fetch products
  useEffect(() => {
    setLoading(true);
    api
      .get("api/products/my_products/")
      .then((res) => {
        setProducts(res.data);
        setFilteredProducts(res.data);
      })
      .catch((error) => alert(error))
      .finally(() => setLoading(false));
  }, []);

  // Filter products based on search term
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  return (
    <motion.div
      id="container"
      initial="hidden"
      animate="visible"
      variants={animations.container}
      className="bg-slate-100 rounded-lg shadow-md sm:p-6 p-4 container mx-auto ss:w-min w-[360px]"
    >
      <div className="flex items-center justify-between mt-2">
        <motion.h1
          variants={animations.title}
          className="text-3xl font-semibold flex items-center gap-2 text-orange-500"
        >
          <IoBookmarks style={{ fontSize: "26px" }} />
          My Products
        </motion.h1>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded-lg outline-none bg-slate-200 w-32 focus:w-40 ease-linear duration-150 text-black pr-10"
            placeholder="Search..."
          />
          <IoSearch
            style={{
              top: "10px",
              right: "10px",
              fontSize: "22px",
              position: "absolute",
            }}
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
          <div className="w-full h-[555px] rounded-b-xl overflow-x-auto bg-gray-100">
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
                  <a
                    href={`/update/${product.id}`}
                    className="hover:text-orange-500"
                  >
                    {product.name}
                  </a>
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
      {loading && <LoadingIndicator />}
    </motion.div>
  );
}

export default MyProducts;

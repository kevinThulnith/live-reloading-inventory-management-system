import LoadingIndicator from "../components/LoadingIndicator";
import { FaFileCirclePlus } from "react-icons/fa6";
import animations from "../components/animation";
import { FaChevronDown } from "react-icons/fa";
import { AiFillProduct } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";
import { useState } from "react";
import api from "../api";

function AddProduct() {
  const [image, setImage] = useState(null);
  const handleClearFile = () => setImage(null);
  const [loading, setLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const handleBrowseClick = () => document.getElementById("file-input").click();
  const [productData, setProductData] = useState({
    name: "",
    price: "",
    quantity: "",
    category: "other",
    description: "",
  });

  // TODO: Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    productData.image = image;

    api
      .post("/api/products/", productData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.status === 201) {
          setLoading(false);
          setProductData({
            name: "",
            price: "",
            quantity: "",
            category: "other",
            description: "",
          });
          setImage(null);
          alert("Product added successfully!");
        }
      })
      .catch((err) => console.error("Error creating product:", err))
      .finally(() => setLoading(false));
  };

  return (
    <motion.div
      id="container"
      initial="hidden"
      animate="visible"
      variants={animations.container}
      className="bg-slate-100 rounded-lg shadow-md sm:p-6 p-4 container mx-auto ss:w-[720px] w-[360px]"
    >
      <motion.h1
        className="text-3xl font-semibold text-orange-600 flex items-center gap-2"
        variants={animations.item}
      >
        Add Product
        <AiFillProduct />
      </motion.h1>
      <motion.form
        className="mt-6 space-y-6 overflow-y-auto h-[600px] px-2"
        onSubmit={handleSubmit}
      >
        <motion.div variants={animations.item}>
          <label className="text-sm font-medium text-orange-600">
            Product Name
          </label>
          <input
            required
            id="name"
            name="name"
            type="text"
            onChange={handleChange}
            value={productData.name}
            placeholder="Enter product name"
            className="mt-3 w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </motion.div>
        <motion.div variants={animations.item}>
          <label className="text-sm font-medium text-orange-600">
            Product Price
          </label>
          <input
            required
            id="price"
            type="text"
            name="price"
            onChange={handleChange}
            value={productData.price}
            pattern="[0-9]+(\.[0-9][0-9]?)?"
            placeholder="Enter product price"
            title="Enter numbers only (e.g., 123 or 123.45)"
            className="mt-3 w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </motion.div>
        <motion.div variants={animations.item}>
          <label className="text-sm font-medium text-orange-600">
            Product Quantity
          </label>
          <input
            required
            type="text"
            id="quantity"
            name="quantity"
            pattern="[0-9]+"
            onChange={handleChange}
            value={productData.quantity}
            placeholder="Enter product quantity"
            title="Enter numbers only (e.g., 123)"
            className="mt-3 w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </motion.div>
        <motion.div variants={animations.item} className="relative">
          <label className="text-sm font-medium text-orange-600">
            Product Category
          </label>
          <select
            required
            id="category"
            name="category"
            onChange={handleChange}
            value={productData.category}
            className="mt-3 w-full px-3 py-2 rounded-md shadow-sm bg-white focus:outline-none appearance-none pr-8 cursor-pointer"
            style={{ backgroundPosition: "right 12px center" }}
          >
            <option className="text-gray-700 hover:bg-gray-100" value="other">
              Other
            </option>
            <option className="text-gray-700 hover:bg-gray-100" value="books">
              Books
            </option>
            <option className="text-gray-700 hover:bg-gray-100" value="sports">
              Sports
            </option>
            <option
              className="text-gray-700 hover:bg-gray-100"
              value="clothing"
            >
              Clothing
            </option>
            <option className="text-gray-700 hover:bg-gray-100" value="home">
              Home & Garden
            </option>
            <option
              className="text-gray-700 hover:bg-gray-100"
              value="electronics"
            >
              Electronics
            </option>
          </select>
          <div className="absolute inset-y-0 right-3 top-8 flex items-center pointer-events-none">
            <FaChevronDown />
          </div>
        </motion.div>
        <div className="flex columns-2 gap-8">
          <motion.div variants={animations.item}>
            {/* Image input */}
            <div className="max-w-md p-5 bg-slate-200 rounded-lg text-base-500">
              {/* Image container */}
              <div
                className={`relative h-[220px] aspect-square rounded-xl mb-4 border-2 border-dashed cursor-pointer transition-colors ${
                  isDragOver
                    ? "border-orange-600 bg-orange-50"
                    : "border-orange-800 bg-slate-300 hover:border-orange-600 hover:bg-orange-50"
                }`}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onClick={handleBrowseClick}
                onDrop={handleDrop}
              >
                {image ? (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Selected Product"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-orange-800">
                    <FaFileCirclePlus className="text-4xl mb-2" />
                    <p className="text-sm font-medium">
                      Browse File to upload!
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Drag & drop or click
                    </p>
                  </div>
                )}
              </div>
              {/* Hidden image input */}
              <input
                type="file"
                id="file-input"
                className="hidden"
                accept=".jpg, .jpeg, .png, .img"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) setImage(file);
                }}
              />
              {/* Image status bar */}
              <div className="flex items-center justify-between bg-orange-500 text-white px-4 py-2 rounded-lg">
                <FaFileCirclePlus className="text-lg" />
                <span className="text-sm font-medium flex-1 mx-3 truncate w-[10ch]">
                  {image ? image.name : "Not selected file"}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClearFile();
                  }}
                  className="hover:text-red-200 transition-colors"
                  disabled={!image}
                >
                  <FaTrash
                    className={`text-sm ${
                      !image ? "opacity-50" : "hover:scale-110"
                    }`}
                  />
                </button>
              </div>
            </div>
          </motion.div>
          <motion.div variants={animations.item}>
            <label className="text-sm font-medium text-orange-600">
              Product Description
            </label>
            <textarea
              required
              rows="11"
              cols="42"
              id="description"
              name="description"
              onChange={handleChange}
              value={productData.description}
              placeholder="Enter product description"
              className="mt-3 w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
            ></textarea>
          </motion.div>
        </div>
        <motion.button
          type="submit"
          disabled={loading}
          className={`font-medium mt-2 px-4 py-2 text-white rounded-lg focus:outline-none w-full ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600"
          }`}
          variants={animations.item}
        >
          {loading ? "Submitting..." : "Submit"}
        </motion.button>
      </motion.form>
      {loading && <LoadingIndicator />}
    </motion.div>
  );
}

export default AddProduct;

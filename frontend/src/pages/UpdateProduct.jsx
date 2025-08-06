import LoadingIndicator from "../components/LoadingIndicator";
import { useParams, useNavigate } from "react-router-dom";
import { FaFileCirclePlus } from "react-icons/fa6";
import animations from "../components/animation";
import { FaChevronDown } from "react-icons/fa";
import { useState, useEffect } from "react";
import { RxUpdate } from "react-icons/rx";
import { FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";
import api from "../api";

function UpdateProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [newImageFile, setNewImageFile] = useState(null);
  const handleBrowseClick = () => document.getElementById("file-input").click();
  const [product, setProduct] = useState({
    name: "",
    price: "",
    image: null,
    quantity: "",
    category: "other",
    is_active: true,
    description: "",
  });

  // TODO: Fetch product data when component mounts
  useEffect(() => {
    setLoading(true);
    api
      .get(`/api/products/${id}/`)
      .then((res) => setProduct(res.data))
      .catch((error) => {
        alert("Error loading product data.");
        console.error("Fetch error:", error);
      })
      .finally(() => setLoading(false));
  }, [id]);

  // !Handle changes to form inputs
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: type === "radio" ? value === "true" : value,
    }));
  };

  // !Handle selection of a new image file
  const handleFileChange = (file) => {
    if (file) setNewImageFile(file);
  };

  const handleClearFile = () => {
    setNewImageFile(null);
    document.getElementById("file-input").value = "";
  };

  // !Drag and Drop Handlers
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
      handleFileChange(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    Object.keys(product).forEach((key) => {
      if (key !== "image" && product[key] !== null)
        formData.append(key, product[key]);
    });
    if (newImageFile) formData.append("image", newImageFile);

    api
      .patch(`/api/products/${id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.status === 200) {
          alert("Product updated successfully!");
          navigate("/my-products");
        }
      })
      .catch((error) => {
        alert("Failed to update product.");
        console.error("Update error:", error.response?.data || error);
      })
      .finally(() => setLoading(false));
  };

  // !Image preview logic
  const imagePreviewSrc = newImageFile
    ? URL.createObjectURL(newImageFile)
    : product.image;

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
        variants={animations.title}
      >
        Update Product
        <RxUpdate />
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
            value={product.name}
            onChange={handleChange}
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
            value={product.price}
            onChange={handleChange}
            pattern="[0-9]+(\.[0-9][0-9]?)?"
            placeholder="Enter product price"
            title="Enter numbers only (e.g., 123 or 123.45)"
            className="mt-3 w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </motion.div>
        <div className="flex columns-2 gap-4">
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
              value={product.quantity}
              placeholder="Enter product quantity"
              title="Enter numbers only (e.g., 123)"
              className="mt-3 w-full px-3 block py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </motion.div>
          <motion.div variants={animations.item}>
            <label className="text-sm font-medium text-orange-600">
              Status
            </label>
            <div className="mt-5 text-slate-500">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="is_active"
                  value="true"
                  checked={product.is_active === true}
                  onChange={handleChange}
                  className="form-radio"
                />
                <span className="ml-2">Active</span>
              </label>
              <label className="inline-flex items-center ml-6">
                <input
                  type="radio"
                  name="is_active"
                  value="false"
                  checked={product.is_active === false}
                  onChange={handleChange}
                  className="form-radio"
                />
                <span className="ml-2">Discontinued</span>
              </label>
            </div>
          </motion.div>
        </div>
        <motion.div variants={animations.item} className="relative">
          <label className="text-sm font-medium text-orange-600">
            Product Category
          </label>
          <select
            required
            id="category"
            name="category"
            onChange={handleChange}
            value={product.category}
            placeholder="Select product category"
            className="mt-3 block w-full px-3 py-2 rounded-md shadow-sm bg-white focus:outline-none appearance-none pr-8 cursor-pointer"
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
            <div className="max-w-md p-5 bg-slate-100 rounded-lg text-base-500">
              {/* Image Container */}
              <div
                className={`relative h-[220px] aspect-square rounded-xl mb-4 border-2 border-dashed cursor-pointer transition-colors ${
                  isDragOver
                    ? "border-orange-600 bg-orange-50"
                    : "border-orange-800 bg-slate-200 hover:border-orange-600 hover:bg-orange-50"
                }`}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onClick={handleBrowseClick}
                onDrop={handleDrop}
              >
                {/* *** CORRECTED IMAGE LOGIC IS HERE *** */}
                {imagePreviewSrc ? (
                  <img
                    src={imagePreviewSrc}
                    alt="Product"
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

              {/* Hidden file input */}
              <input
                type="file"
                id="file-input"
                className="hidden"
                accept=".jpg, .jpeg, .png, .img"
                onChange={(e) => {
                  handleFileChange(e.target.files[0]);
                }}
              />

              {/* Image status bar */}
              <div className="flex items-center justify-between bg-orange-500 text-white px-4 py-2 rounded-lg">
                <FaFileCirclePlus className="text-lg" />
                <span className="text-sm font-medium flex-1 mx-3 truncate w-[10ch]">
                  {/* Display the new file name if it exists */}
                  {newImageFile ? newImageFile.name : "Not selected file"}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClearFile();
                  }}
                  className="hover:text-red-200 transition-colors"
                  disabled={!newImageFile}
                >
                  <FaTrash
                    className={`text-sm ${
                      !newImageFile ? "opacity-50" : "hover:scale-110"
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
              value={product.description}
              placeholder="Enter product description"
              className="mt-3  w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
            ></textarea>
          </motion.div>
        </div>
        <div className="flex columns-2 gap-4">
          <motion.button
            className="font-medium text-slate-100 bg-orange-600 w-full py-2 rounded-lg"
            variants={animations.item}
            type="submit"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Product"}
          </motion.button>
          <motion.button
            className="font-medium text-slate-100 bg-orange-600 w-full py-2 rounded-lg"
            values={animations.item}
          >
            <a
              href={`/delete/${id}`}
              className="flex items-center justify-center gap-2"
            >
              Delete
            </a>
          </motion.button>
        </div>
      </motion.form>
      {loading && <LoadingIndicator />}
    </motion.div>
  );
}

export default UpdateProduct;

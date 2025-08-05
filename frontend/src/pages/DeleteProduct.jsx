import LoadingIndicator from "../components/LoadingIndicator";
import { FaTrash } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import api from "../api";

function DeleteProduct() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    api
      .delete(`api/products/${id}/`)
      .then(() => {
        alert("Product deleted successfully!");
        navigate("/my-products");
      })
      .catch((error) => alert(error))
      .finally(() => setLoading(false));
  };

  return (
    <div className="container px-8">
      <div className="bg-slate-100 rounded-lg p-6 max-w-screen-md">
        <h2 className="text-2xl mb-4 font-medium flex items-center gap-2 text-red-600">
          <FaTrash aria-hidden="true" /> Delete Product
        </h2>
        <p className="text-gray-500 text-justify">
          You are about to permanently delete this product from the system. This
          action cannot be undone and will remove all associated data, including
          descriptions, images, and inventory details. If this product is linked
          to any orders, reports, or other records, those references may also be
          affected. Please review your selection carefully before proceeding. If
          you are unsure, consider archiving the product instead of deleting it.
        </p>
        <form onSubmit={handleSubmit}>
          <button
            type="submit"
            className="mt-4 px-3 py-2 font-medium text-slate-100 bg-red-500 rounded-lg hover:bg-blue-600 focus:outline-none"
          >
            Delete
          </button>
        </form>
        {loading && <LoadingIndicator />}
      </div>
    </div>
  );
}

export default DeleteProduct;

import { useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import api from "../api";

function Home() {
  const [userInfo, setUserInfo] = useState({ username: "", email: "" });

  // TODO: Refresh the page when the page is loaded for the first time
  if (!localStorage.getItem("refreshed")) {
    localStorage.setItem("refreshed", "true");
    window.location.reload();
  }

  useMemo(() => {
    if (localStorage.getItem("refreshed") === "true") {
      api
        .get("api/user/")
        .then((res) => setUserInfo(res.data))
        .catch((error) => alert(error));
    }
  }, []);

  return (
    <div className="container">
      <div className="w-full bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
        <h2 className="text-lg capitalize text-gray-600 ml-4">
          {userInfo.username}, Welcome Back!!
        </h2>
        <a
          href="/add-product"
          className="bg-gray-500 text-white text-lg py-2 px-4 rounded hover:bg-gray-600 outline-none ease-in duration-100"
        >
          <FaPlus className="inline mr-2" />
          Add Product
        </a>
      </div>
    </div>
  );
}

export default Home;

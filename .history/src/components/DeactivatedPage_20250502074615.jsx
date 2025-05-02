import React from "react";
import { useNavigate } from "react-router-dom";

const DeactivatedPage = () => {
  const navigate = useNavigate();

  const handleDeactivate = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must be logged in.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/user/deactivate", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert("Account deactivated.");
        localStorage.removeItem("token"); // Log out
        navigate("/login"); // Redirect to login
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || "Unable to deactivate"}`);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl text-center">
      <h2 className="text-2xl font-semibold mb-4">Deactivate Account</h2>
      <p className="mb-6 text-gray-600">
        Are you sure you want to deactivate your account? You can reactivate it later by contacting support.
      </p>
      <button
        onClick={handleDeactivate}
        className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold"
      >
        Confirm Deactivation
      </button>
    </div>
  );
};

export default DeactivatedPage;

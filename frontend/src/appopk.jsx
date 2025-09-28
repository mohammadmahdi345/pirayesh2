// Appointmentadmin1.jsx
import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import StatusSelect from "./StatusSelect"; // مسیر را در پروژه‌ات تنظیم کن


const Appointmentadmin1 = () => {
  const { pk } = useParams();
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");

  const options = [
    { value: "approved", label: "تایید شده" },
    { value: "waiting", label: "در انتظار" },
    { value: "cancelled", label: "لغو شده" },
  ];

  const handleClick = async () => {
    try {
      await axios.patch(
        `http://localhost:8005/Appointments/admin/${pk}/`,
        { status },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setMessage("✅ وضعیت با موفقیت تغییر کرد");
    } catch (error) {
      setMessage(error.response?.data?.detail || "❌ خطای ناشناخته‌ای رخ داد");
    }
  };

  return (
  <div className="admin-page-fallback">
    <div className="admin-container">
      <h2>وضعیت رزرو را تغییر دهید</h2>

      <div style={{ maxWidth: 380 }}>
        <StatusSelect
          value={status}
          onChange={setStatus}
          options={options}
          placeholder="-- انتخاب وضعیت --"
        />
      </div>

      <div style={{ marginTop: 14 }}>
        <button className="reserv-cancell2 primary-btn" onClick={handleClick}>
          تغییر وضعیت
        </button>
      </div>

      {message && (
        <h3 className={`message ${message.startsWith("❌") ? "error" : ""}`}>
          {message}
        </h3>
      )}
    </div>
  </div>
);

};

export default Appointmentadmin1;

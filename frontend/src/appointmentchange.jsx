import { useState, useEffect } from "react";
import axios from "axios";


const Appointment = () => {
  const [appo, setAppo] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get("http://localhost:8005/Appointments/");
      setAppo(response.data);
    } catch (err) {
      setError("کاربر پیدا نشد");
    }
  };

  const handleCancel = async (pk) => {
    try {
      const response = await axios.patch(`http://localhost:8005/Appointments/cancelled/${pk}/`);
      await fetchAppointments();
      setMessage("✅ نوبت با موفقیت کنسل شد");
    } catch (err) {
      console.error(err);
      setMessage("❌ خطایی رخ داد");
    }
  };

  return (
    <div className="appointment-page">
      <h1 className="appointment-title">کنسل کردن نوبت‌ها</h1>

      {message && <div className="appointment-message">{message}</div>}
      {error && <div className="appointment-error">{error}</div>}

      <div className="appointment-list">
        {appo.map((a) => (
          <div key={a.pk} className="appointment-card">
            <div className="appointment-info">
              <h3 className="appointment-user">{a.user.username}</h3>
              <p className="appointment-hair">{a.hairstyle_name}</p>
              <p className="appointment-date">📅 {a.date}</p>
              <p className="appointment-time">
                ⏰ {a.time_slot.start_time} - {a.time_slot.end_time}
              </p>
              <p className="appointment-status">وضعیت: {a.status}</p>
            </div>
            <button
              className="appointment-cancel-btn"
              onClick={() => handleCancel(a.pk)}
            >
              کنسل
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Appointment;

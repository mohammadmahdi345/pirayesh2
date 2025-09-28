import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";


const TimeSlots = () => {
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [error, setError] = useState("");

  const fetchSlots = async (selectedDate) => {
    try {
      const response = await axios.get("http://localhost:8005/timeslots/", {
        params: { date: selectedDate },
      });
      setSlots(response.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.error || "خطا در دریافت تایم‌اسلات‌ها");
    }
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setDate(selectedDate);
    if (selectedDate) {
      fetchSlots(selectedDate);
    } else {
      setSlots([]);
    }
  };

  return (
    <div className="timeslots-root">
      {/* بک‌گراند زنده */}
      <div className="bg-container">
        {[...Array(80)].map((_, i) => (
          <div key={i} className="circle-container">
            <div className="circle"></div>
          </div>
        ))}
      </div>

      {/* محتوای اصلی */}
      <div className="timeslots-panel">
        <h2 className="timeslots-title">تایم‌های خالی سالن</h2>
        <input
          type="date"
          value={date}
          onChange={handleDateChange}
          className="date-input"
        />

        {error && <p className="error-msg">{error}</p>}

        <ul className="slots-list">
          {slots.length === 0 && date && <li>تایمی موجود نیست</li>}
          {slots.map((slot) => (
            <li key={slot.id} className="slot-card">
              <span>
                {slot.start_time} - {slot.end_time}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TimeSlots;

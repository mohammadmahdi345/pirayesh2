import React, { useState, useEffect } from "react";
import axios from "axios";

const TimeSlots = () => {
  const [date, setDate] = useState(""); // تاریخ انتخابی
  const [slots, setSlots] = useState([]);
  const [error, setError] = useState("");

  const fetchSlots = async (selectedDate) => {
    try {
      const response = await axios.get("http://localhost:8005/timeslots/", {
        params: { date: selectedDate } // ← اینجا query params میره
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
    <div>
      <h2>تایم‌اسلات‌ها</h2>
      <input type="date" value={date} onChange={handleDateChange} />
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {slots.map((slot) => (
          <li key={slot.id}>
            {slot.start_time} - {slot.end_time}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TimeSlots;

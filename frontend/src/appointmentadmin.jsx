// Appointmentadmin.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";


const Appointmentadmin = () => {
  const [appo, setAppo] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get("http://localhost:8005/Appointments/all/");
        setAppo(Array.isArray(response.data) ? response.data : response.data.results || []);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setAppo([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const statusClass = (s) => {
    switch ((s || "").toLowerCase()) {
      case "approved":
      case "done":
        return "status success";
      case "waiting":
      case "pending":
        return "status pending";
      case "cancelled":
      case "canceled":
        return "status danger";
      default:
        return "status neutral";
    }
  };

  return (
    <div className="admin-appointment-wrap">
      <header className="admin-appointment-head">
        <h2>مدیریت رزروها</h2>
        <p className="muted">برای مشاهده جزئیات روی هر کارت کلیک کنید</p>
      </header>

      {loading ? (
        <div className="admin-empty">در حال بارگذاری رزروها...</div>
      ) : appo.length === 0 ? (
        <div className="admin-empty">هیچ رزروی وجود ندارد.</div>
      ) : (
        <section className="admin-appointment-grid" role="list">
          {appo.map((a) => (
            <article key={a.pk} className="appo-card" role="listitem">
              <Link to={`/appointment/admin/${a.pk}`} className="appo-link" aria-label={`جزئیات رزرو ${a.pk}`}>
                <div className="appo-card-head">
                  <div className="appo-user">{a.user?.username ?? "کاربر ناشناس"}</div>
                  <div className={statusClass(a.status)}>{a.status ?? "—"}</div>
                </div>

                <div className="appo-body">
                  <div className="appo-row">
                    <span className="label">مدل مو</span>
                    {/* <-- از فیلد nested درست استفاده کردم */}
                    <strong className="value">{a.hairstyle?.name ?? "—"}</strong>
                  </div>

                  <div className="appo-row">
                    <span className="label">تاریخ</span>
                    <span className="value">{a.date ?? "—"}</span>
                  </div>

                  <div className="appo-row">
                    <span className="label">تایم</span>
                    <span className="value">
                      {a.time_slot?.start_time
                        ? `${a.time_slot.start_time} - ${a.time_slot.end_time ?? ""}`
                        : "—"}
                    </span>
                  </div>
                </div>

                <footer className="appo-card-foot">
                  <small className="muted">#{a.pk} — ایجادشده: {a.created_time ? new Date(a.created_time).toLocaleString("fa-IR") : "—"}</small>
                </footer>
              </Link>
            </article>
          ))}
        </section>
      )}
    </div>
  );
};

export default Appointmentadmin;

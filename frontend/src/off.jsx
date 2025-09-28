import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Off = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const hairFromUrl = queryParams.get("hair");

  const [hairs, setHairs] = useState([]);
  const [hair, setHair] = useState(hairFromUrl || "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [times, setTimes] = useState([]);
  const [message, setMessage] = useState("");
  const [previewHair, setPreviewHair] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingTimes, setLoadingTimes] = useState(false);

  // گرفتن لیست مدل‌ها
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:8005/hairs/");
        const data = Array.isArray(res.data) ? res.data : res.data.results || res.data.items || [];
        setHairs(data);

        // اگر hair از URL آمده، پیش‌نمایش رو تنظیم کن
        if (hairFromUrl) {
          const selected = data.find((h) => String(h.pk) === String(hairFromUrl));
          if (selected) {
            setPreviewHair(selected);
            setHair(String(selected.pk));
          } else {
            setPreviewHair(null);
          }
        }
      } catch (err) {
        console.error("خطا در دریافت مدل‌ها:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [hairFromUrl]);

  // وقتی تاریخ انتخاب شد، تایم‌اسلات‌های در دسترس رو بگیر
  useEffect(() => {
    const fetchTimes = async (selectedDate) => {
      if (!selectedDate) {
        setTimes([]);
        return;
      }
      try {
        setLoadingTimes(true);
        // <-- اگر API پارامتری غیر از ?date میخواد این خطو ویرایش کن
        const res = await axios.get(`http://localhost:8005/timeslots/?date=${encodeURIComponent(selectedDate)}`);
        const data = Array.isArray(res.data) ? res.data : res.data.results || res.data.items || [];
        setTimes(data);
        // اگر زمان انتخاب‌شده قبلی با لیست جدید همخوانی نداره، پاکش کن
        if (time && !data.find((t) => String(t.id) === String(time))) {
          setTime("");
        }
      } catch (err) {
        console.error("خطا در دریافت تایم‌ها:", err);
        setTimes([]);
      } finally {
        setLoadingTimes(false);
      }
    };

    fetchTimes(date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  // پیام هشدار وقتی هیچ مدلی انتخاب نشده
  const noHairSelected = !hair;

  // ثبت رزرو
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!hair || !date || !time) {
      setMessage("⚠️ لطفاً مدل مو، تاریخ و تایم‌اسلات را انتخاب کنید.");
      return;
    }

    try {
      const payload = {
        hairstyle: hair,
        date,
        time_slot: time,
      };
      const res = await axios.post("http://localhost:8005/offs/", payload);

      const appo = res.data.pk;
      setMessage("✅ نوبت شما ثبت شد");
      navigate(`/payment/${appo}`)
      console.log("ثبت رزرو:", res.data);
    } catch (err) {
      setMessage("❌ خطا در ثبت نوبت. دوباره تلاش کنید");
      console.error(err);
    }
  };

  // وقتی کاربر در صفحه انتخاب مدل‌ها یکی رو انتخاب کنه و به اینجا برگرده،
  useEffect(() => {
    if (!hairFromUrl) return;
    if (hairFromUrl && (!previewHair || String(previewHair.pk) !== String(hairFromUrl))) {
      const selected = hairs.find((h) => String(h.pk) === String(hairFromUrl));
      if (selected) {
        setPreviewHair(selected);
        setHair(String(selected.pk));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hairs, hairFromUrl]);

  // رفتن به صفحه انتخاب مدل‌ها
  const goToHairList = () => {
    navigate("/hairs");
  };

  // انتخاب محلی مدل
  const handleSelectLocal = (h) => {
    setHair(String(h.pk));
    setPreviewHair(h);
  };

  return (
    <div className="off-page">
      <form className="off-form" onSubmit={handleSubmit} noValidate>
        <h1 className="off-title">برای ثبت نوبت اقدام کنید</h1>

        {/* هشدار بالا */}
        {noHairSelected && (
          <div className="off-warning" role="status" aria-live="polite">
            ⚠️ هیچ مدل مویی انتخاب نشده.
          </div>
        )}

        <div className="off-layout">
          {/* چپ: پریویو (فقط وقتی مدل انتخاب شده) و فیلدها */}
          <div className="off-left">
            {/* PREVIEW */}
            {previewHair ? (
              <div className="hair-preview-card">
                <img
                  src={previewHair.image || "https://via.placeholder.com/320x240?text=No+Image"}
                  alt={previewHair.name}
                  className="hair-preview-img"
                />
                <div className="hair-preview-body">
                  <h3 className="hair-preview-title">{previewHair.name}</h3>
                  <p className="hair-preview-meta">
                    💰 {previewHair.price ? new Intl.NumberFormat("fa-IR").format(Number(previewHair.price)) + " تومان" : "—"}
                  </p>
                  <p className="hair-preview-meta">⏳ {previewHair.time_excepted || "—"}</p>
                  <div className="hair-preview-actions">
                    <button
                      type="button"
                      className="change-hair-btn"
                      onClick={goToHairList}
                    >
                      تغییر مدل
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="hair-preview-card hair-preview-empty">
                <div className="hair-preview-empty-text">مدلی انتخاب نشده — برای دیدن مدل‌ها کلیک کنید</div>
                <button type="button" className="select-hair-btn large" onClick={goToHairList}>
                  انتخاب مدل مو
                </button>
              </div>
            )}

            {/* فرم فیلدها */}
            <div className="form-fields-stack">
              <label className="field-label">تاریخ</label>
              <input
                className="off-input"
                type="date"
                name="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />

              <label className="field-label">تایم‌اسلات</label>

              {/* ----- نمایش تایم‌ها به صورت چِیپ‌های قابل کلیک ----- */}
              {loadingTimes ? (
                <div style={{ color: "var(--muted)" }}>در حال بارگذاری تایم‌ها...</div>
              ) : times && times.length > 0 ? (
                <div className="time-chips" role="list">
                  {times.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className={`time-chip ${String(time) === String(s.id) ? "selected" : ""}`}
                      onClick={() => setTime(String(s.id))}
                      role="listitem"
                      aria-pressed={String(time) === String(s.id)}
                    >
                      {s.start_time} - {s.end_time}
                    </button>
                  ))}
                </div>
              ) : (
                // fallback: show select with disabled option (keeps accessibility)
                <select
                  className="off-select"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                >
                  <option value="">-- انتخاب تایم‌اسلات --</option>
                </select>
              )}

              <button className="off-button" type="submit" disabled={loading}>
                {loading ? "در حال ارسال..." : "ثبت نوبت"}
              </button>
            </div>
          </div>

          {/* راست: اطلاعات کمکی / پیام */}
          <aside className="off-side" aria-live="polite">
            <p className="meta">توضیحات: پس از ثبت، به صفحه پرداخت هدایت می‌شوید.</p>
            {message && <div className="off-message" role="status">{message}</div>}
          </aside>
        </div>
      </form>
    </div>
  );
};

export default Off;

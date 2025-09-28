import React, { useEffect, useState,useMemo  } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const makeSlug = (s) =>
  String(s || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]/g, "");

const COLORS = [
  "#241379","#2185bf","#1fbce1",
  "#b62f56","#d5764c","#ffd53e",
  "#78ffba","#98fd85","#befb46",
  "#6c046c","#f04c81","#ff4293"
];

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const Hair = () => {
  const [hairs, setHairs] = useState([]);
  const [error, setError] = useState(null);
  const [activePk, setActivePk] = useState(null);

  useEffect(() => {
    const fetchHairs = async () => {
      try {
        const response = await axios.get("http://localhost:8005/hairs/");
        const data = Array.isArray(response.data)
          ? response.data
          : response.data.results || response.data.items || [];
        setHairs(data);
      } catch (err) {
        setError(err.response?.data || err.message || "خطا در دریافت داده‌ها");
      }
    };
    fetchHairs();
  }, []);

  // گروه‌بندی بر اساس دسته‌بندی
  const grouped = hairs.reduce((acc, h) => {
    const cat = h.category?.name || "بدون دسته‌بندی";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(h);
    return acc;
  }, {});

  const toggleOpen = (pk) => {
    setActivePk((p) => (p === pk ? null : pk));
  };

  // --- تولید آرایه‌ی حباب‌ها (فقط یک‌بار در mount) ---
  const bubbles = useMemo(() => {
    const list = [];
    const count = 20; // تعداد حباب‌ها — می‌تونی بیشتر یا کمتر کنی
    for (let i = 0; i < count; i++) {
      const color = COLORS[i % COLORS.length];
      const size = rand(8, 60); // px
      const x1 = rand(-10, 110);
      const y1 = rand(-10, 110);
      const x2 = rand(-10, 110);
      const y2 = rand(-10, 110);
      const x3 = rand(-10, 110);
      const y3 = rand(-10, 110);
      const dur = (rand(18, 44) + Math.random()).toFixed(2); // s
      const dur2 = (rand(10, 36) + Math.random()).toFixed(2);
      const delay = (Math.random() * 8).toFixed(2);
      list.push({ color, size, x1, y1, x2, y2, x3, y3, dur, dur2, delay });
    }
    return list;
  }, []);

  if (error)
    return (
      <div className="hair-page">
        <p style={{ color: "#ffb4b4" }}>خطا: {String(error)}</p>
      </div>
    );

  return (
    <div className="hair-page">
      {/* لایه‌ی بک‌گراند متحرک (حباب‌ها) */}
      <div className="bg-bubbles" aria-hidden="true">
        {bubbles.map((b, i) => (
          <div
            key={i}
            className="bubble"
            style={{
              // تنظیم متغیرهای CSS که در CSS ازشون استفاده می‌کنیم
              ["--bg-color"]: b.color,
              ["--size"]: `${b.size}px`,
              ["--x1"]: `${b.x1}vw`,
              ["--y1"]: `${b.y1}vh`,
              ["--x2"]: `${b.x2}vw`,
              ["--y2"]: `${b.y2}vh`,
              ["--x3"]: `${b.x3}vw`,
              ["--y3"]: `${b.y3}vh`,
              ["--dur"]: `${b.dur}s`,
              ["--dur2"]: `${b.dur2}s`,
              ["--delay"]: `${b.delay}s`,
            }}
          />
        ))}
      </div>

      {/* محتوای قبلی شما (دقیقاً بدون تغییر به‌جز افزودن id/data) */}
      {Object.keys(grouped).map((cat) => (
        <section key={cat} className="hair-category" aria-label={cat}>
          <div className="hair-category-title">
            <div className="pill">{cat}</div>
          </div>

          <div className="hair-grid">
            {grouped[cat].map((h) => (
              <article
                id={`hair-${h.pk}`}                       /* ← اضافه شده */
                data-slug={makeSlug(h.name)}              /* ← اختیاری، مفید برای دسترسی */
                data-name={h.name}                        /* ← اختیاری */
                key={h.pk}
                className={`hair-card ${activePk === h.pk ? "open" : ""}`}
                aria-expanded={activePk === h.pk}
              >
                {/* LEFT overlay */}
                <div className="hair-overlay">
                  <div>
                    <div className="name">{h.name}</div>
                    <div className="meta">مدت: {h.time_excepted ?? "—"}</div>
                  </div>

                  {/* دکمه رزرو */}
                  <Link
                    to={`/off?hair=${h.pk}`}
                    className="book-btn"
                    aria-label={`رزرو مدل ${h.name}`}
                  >
                    رزرو
                  </Link>

                  <div className="price">
                    {h.price
                      ? new Intl.NumberFormat("fa-IR").format(Number(h.price))
                      : "—"}
                  </div>
                </div>

                {/* RIGHT image */}
                <div className="hair-image-area">
                  <div
                    className="hair-image"
                    style={{
                      backgroundImage: `url(${h.image || "https://via.placeholder.com/800x600?text=No+Image"})`,
                    }}
                    role="img"
                    aria-label={h.name}
                  />

                  <div className="hair-dots" aria-hidden>
                    <span className="dot" />
                    <span className="dot" />
                    <span className="dot" />
                  </div>

                  <button
                    className="hair-click"
                    onClick={() => toggleOpen(h.pk)}
                    aria-label={
                      activePk === h.pk ? "بستن توضیحات" : "نمایش توضیحات"
                    }
                  />

                  <div className="hair-text" role="region" aria-live="polite">
                    <h3>{h.name}</h3>
                    {h.description ? (
                      <p>{h.description}</p>
                    ) : (
                      <p>توضیحی ثبت نشده است.</p>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default Hair;
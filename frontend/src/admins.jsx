import React, { Component,useEffect,useState,useRef } from 'react';
import Appointmentadmin from './appointmentadmin';
import { Link } from 'react-router-dom';
import CommentStats from './commentstats';
import CommentAllStats from './commentallstat';
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import AnimatedText from './AnimatedText';


const Admins = ({ user }) => {
  const [active, setActive] = useState(null);

  // map برای عنوان‌ها + آیکون
  const headerMap = {
    appointment: { title: "رزروها", icon: "📅" },
    stats: { title: "آمار", icon: "📊" },
    comments: { title: "نظرات", icon: "💬" },
    default: { title: "پنل ادمین", icon: "🎛️" },
  };

  // عنوان فعلی بر اساس active
  const header = headerMap[active] || headerMap.default;

  // sync عنوان تب مرورگر (اختیاری)
  useEffect(() => {
    document.title = `${header.title} — مدیریت`;
    return () => {
      document.title = "پنل ادمین";
    };
  }, [header.title]);

  // helper برای رندر محتوا بر اساس active
  const renderContent = () => {
    if (active === "appointment") return <Appointmentadmin />;
    if (active === "stats") return <CommentStats />;
    if (active === "comments") return <CommentAllStats />;
    // حالت پیش‌فرض خوش‌آمدگویی
    return (
      <div className="admin-welcome">
        <AnimatedText text="به پنل ادمین خوش آمدید" />
        <p className="rainbow-text">
          از منو بالا یکی از بخش‌ها را انتخاب کنید تا اطلاعات مربوطه اینجا نمایش داده شود
        </p>
      </div>
    );
  };

  // اگر کاربر ادمین نیست
  if (!user?.is_staff) {
    return (
      <div className="admin-page">
        <div className="admin-overlay">
          <div className="admin-header-row" style={{ position: "relative" }}>
            {/* عنوان وسط با یک wrapper جدا (inline style برای تضمین مرکزیت) */}
            <div style={{ width: "100%", textAlign: "center", pointerEvents: "none" }}>
              <h1 className="admin-title" style={{ display: "inline-block", margin: 0, pointerEvents: "auto" }}>
                🎛️ پنل ادمین
              </h1>
            </div>
          </div>

          <div className="admin-content">
            <div className="admin-empty">
              دسترسی ندارید — این بخش فقط برای ادمین‌ها قابل مشاهده است.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page" role="region" aria-label="پنل مدیریت">
      <div className="admin-overlay">
        {/* HEADER: عنوان کاملاً وسط قرار می‌گیرد (wrapper با textAlign:center) */}
        <div className="admin-header-row" style={{ position: "relative" }}>
          <div style={{ width: "100%", textAlign: "center", pointerEvents: "none" }}>
            <h1
              className="admin-title"
              aria-live="polite"
              style={{ display: "inline-block", margin: 0, pointerEvents: "auto" }}
            >
              <span aria-hidden style={{ fontSize: "1.05em" }}>{header.icon}</span>
              <span style={{ marginInlineStart: 8 }}>{header.title}</span>
            </h1>
          </div>
        </div>

<div className="admin-buttons" role="toolbar" aria-label="ابزارهای ادمین">
  <button
    className={`admin-btn large ${active === "appointment" ? "active" : ""}`}
    onClick={() => setActive((v) => (v === "appointment" ? null : "appointment"))}
    aria-pressed={active === "appointment"}
    title="رزروها"
  >
    <span className="icon">📅</span>
    <span className="btn-label">رزروها</span>
    <svg className="btn-svg" viewBox="0 0 100 40" preserveAspectRatio="none">
      <rect className="anim-path" x="2" y="2" width="96" height="36" rx="10" ry="10" fill="none" />
    </svg>
  </button>

  <button
    className={`admin-btn ${active === "stats" ? "active" : ""}`}
    onClick={() => setActive((v) => (v === "stats" ? null : "stats"))}
    aria-pressed={active === "stats"}
    title="وضعیت"
  >
    <span className="icon">📊</span>
    <span className="btn-label">وضعیت</span>
    <svg className="btn-svg" viewBox="0 0 100 40" preserveAspectRatio="none">
      <rect className="anim-path warm" x="2" y="2" width="96" height="36" rx="10" ry="10" fill="none" />
    </svg>
  </button>

  <button
    className={`admin-btn large ${active === "comments" ? "active" : ""}`}
    onClick={() => setActive((v) => (v === "comments" ? null : "comments"))}
    aria-pressed={active === "comments"}
    title="نظرات"
  >
    <span className="icon">💬</span>
    <span className="btn-label">نظرات</span>
    <svg className="btn-svg" viewBox="0 0 100 40" preserveAspectRatio="none">
      <rect className="anim-path cool" x="2" y="2" width="96" height="36" rx="10" ry="10" fill="none" />
    </svg>
  </button>
</div>


        <div className="admin-content admin-content-grid" aria-live="polite">
          <div className="admin-panel" style={{ gridColumn: "1 / -1" }}>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admins;

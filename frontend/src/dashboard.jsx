
//axios.defaults.headers.common['token'] = localStorage.getItem('token')

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";


const Dashboard = () => {
  const [entered, setEntered] = useState(false);

  // تا کارت‌ها با تأخیر کوتاه انیمیت بشن (ورود smooth)
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 40);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`dashboard-page ${entered ? "entered" : ""}`}>
      <header className="dashboard-hero" role="banner" aria-label="Dashboard hero">
        <div className="barber-hero">
          <div className="barber-pole" aria-hidden="true" />
          <div className="hero-text">
            <h1>داشبورد</h1>
            <p>مدیریت نوبت‌ها، تایم‌ها و کنسلی‌ها — سریع و شیک</p>
          </div>
          <div className="hero-anim" aria-hidden="true">
            <div className="scissors">✂️</div>
          </div>
        </div>
      </header>

      <main className="dashboard-inner" role="main">
        <div className="dashboard-grid" aria-live="polite">
          <article className="dash-card" tabIndex={0}>
            <div className="dash-card-head">
              <div className="dash-icon">🗓️</div>
              <h3>ثبت نوبت</h3>
            </div>
            <p className="dash-desc">ایجاد نوبت جدید برای مشتری‌</p>
            <Link to="/off" className="dash-btn" aria-label="ثبت نوبت">
              برو به ثبت
            </Link>
          </article>

          <article className="dash-card" tabIndex={0}>
            <div className="dash-card-head">
              <div className="dash-icon">❌</div>
              <h3>کنسل کردن نوبت</h3>
            </div>
            <p className="dash-desc">مشاهده و کنسل کردن نوبت‌ها</p>
            <Link to="/appointment/cancelled" className="dash-btn" aria-label="کنسل کردن نوبت">
              برو به کنسل‌ها
            </Link>
          </article>

          <article className="dash-card" tabIndex={0}>
            <div className="dash-card-head">
              <div className="dash-icon">⏱️</div>
              <h3>تایم‌های خالی</h3>
            </div>
            <p className="dash-desc">مشاهده و مدیریت تایم‌اسلات‌های آزاد</p>
            <Link to="/timeslot" className="dash-btn" aria-label="تایم های خالی">
              نمایش تایم‌ها
            </Link>
          </article>

          <article className="dash-card" tabIndex={0}>
            <div className="dash-card-head">
              <div className="dash-icon">💬</div>
              <h3>ثبت نظر و امتیاز</h3>
            </div>
            <p className="dash-desc">برای آگاهی از کیفیت خدمات، لطفاً نظر و امتیاز خود را ثبت کنید</p>
            <Link to="/comment" className="dash-btn" aria-label="ثبت نظر و امتیاز">
              ثبت نظر و امتیاز
            </Link>
          </article>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;

import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";


const LoginForm = () => {
  const [account, setAccount] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState([]); // آرایه خطاها (نمایش)
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const navigate = useNavigate();
  const btnRef = useRef(null);

  const validate = () => {
    const errs = [];
    if (!account.username || account.username.trim() === "") {
      errs.push("لطفاً نام کاربری را وارد کنید");
    }
    if (!account.password || account.password.length < 5) {
      errs.push("رمز عبور حداقل باید ۵ کاراکتر باشد");
    }
    setErrors(errs);
    return errs.length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAccount((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setErrors([]);
    setStatus("sending");

    try {
      const res = await axios.post("http://localhost:8005/login/", {
        username: account.username,
        password: account.password,
      });

      // فرض بر این است که پاسخ token دارد
      const token = res?.data?.tokens?.access_token || res?.data?.token || null;
      if (token) localStorage.setItem("token", token);

      // success animation
      setStatus("success");

      // صبر می‌کنیم انیمیشن کامل شود (مطابق CSS ~1200ms)
      // بعد redirect می‌کنیم — اگر می‌خواهی تغییر بدهی زمان را.
      setTimeout(() => {
        navigate("/dashboard");
      }, 1100);
    } catch (err) {
      console.error(err);
      // نمایش پیغام خطای مناسب
      setStatus("error");
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "نام کاربری یا رمز عبور صحیح نمی‌باشد";
      setErrors([msg]);

      // بعد از نمایش خطا انیمیشن را ریست می‌کنیم تا دوباره ارسال بشود
      setTimeout(() => setStatus("idle"), 1200);
    }
  };

  return (
    <div className="glow-login-root">
      <div className="glow-login-toplink">
        <Link to="/">صفحه اصلی</Link>
      </div>

      <main className="glow-login-panel" role="main" aria-labelledby="loginHeading">
        <h2 id="loginHeading" className="glow-login-title">وارد شو</h2>

        {errors.length > 0 && (
          <div className="glow-login-errors" role="alert">
            <ul>
              {errors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        )}

        <form className="glow-login-form" onSubmit={handleSubmit} noValidate>
          <div className={`field ${account.username ? "filled" : ""}`}>
            <input
              id="username"
              name="username"
              type="text"
              value={account.username}
              onChange={handleChange}
              required
              autoComplete="username"
            />
            <label htmlFor="username">نام کاربری</label>
          </div>

          <div className={`field ${account.password ? "filled" : ""}`}>
            <input
              id="password"
              name="password"
              type="password"
              value={account.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
            <label htmlFor="password">رمز عبور</label>
          </div>

          <button
            ref={btnRef}
            className={`auth-btn ${status}`}
            type="submit"
            aria-live="polite"
            disabled={status === "sending" || status === "success"}
          >
            <span className="btn-label">ورود</span>

            {/* spinner */}
            <svg className="btn-spinner" viewBox="0 0 50 50" aria-hidden>
              <circle cx="25" cy="25" r="20" fill="none" strokeWidth="4" />
            </svg>

            {/* check mark */}
            <svg className="btn-check" viewBox="0 0 24 24" aria-hidden>
              <path d="M20 6L9 17l-5-5" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </form>

        <div className="glow-login-footer">
          <p>اکانت نداری؟ <Link to="/register">ثبت‌نام کن</Link></p>
        </div>
      </main>
    </div>
  );
};

export default LoginForm;

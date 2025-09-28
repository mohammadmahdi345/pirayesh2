
// Logout.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // پاک‌کردن همه کلیدهای توکنی که ممکن استفاده کرده باشی
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("tokens");
      // اگر هر کلید دیگری هم میزنی اینجا اضافه کن
    } catch (e) {
      // ignore
      console.warn("Logout: unable to remove localStorage keys", e);
    }

    // در صورت لزوم می‌تونی یک درخواست به backend برای revoke بفرستی قبل از ری‌دایرکت.

    // ری‌دایرکت به صفحه لاگین (جایگزین کن مسیر اگر /login نیست)
    navigate("/login", { replace: true });
  }, [navigate]);

  // می‌تونیم یه پیام کوتاه نمایش بدیم (اختیاری)
  return (
    <div aria-live="polite" style={{
      minHeight: "60vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#eaf8f2"
    }}>
      <div>در حال خروج — درحال انتقال به صفحهٔ ورود...</div>
    </div>
  );
}

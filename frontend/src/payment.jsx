import React, { useState, useEffect,useCallback  } from "react";
import axios from "axios";
import { useParams,Link } from "react-router-dom";

const Payment = () => {
  const { pk } = useParams();

  const [payment, setPayment] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // '' | 'error' | 'info'
  const [loading, setLoading] = useState(false);

  // fetchPayment بیرون از useEffect تا قابل فراخوانی مجدد باشه (retry)
  const fetchPayment = useCallback(async () => {
    if (!pk) {
      setMessage("شناسه نامعتبر.");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("درحال اتصال به درگاه...");
    setMessageType("info");

    try {
      const response = await axios.post(`http://localhost:8005/payment/${pk}/`);
      setPayment(response.data);
      setMessage(""); // پاک کن پیام‌های موقتی
      setMessageType("");
    } catch (error) {
      console.error("Payment fetch error:", error.response?.data || error.message);
      // اگر پیام خطای سرور داریم، سعی کن دقیق‌تر نمایش بدی
      const serverMsg = error.response?.data?.detail || error.response?.data || null;
      setPayment(null);
      setMessage(
        serverMsg
          ? typeof serverMsg === "string"
            ? serverMsg
            : JSON.stringify(serverMsg)
          : "خطا در پردازش پرداخت — لطفاً اتصال را بررسی کرده و مجدداً تلاش کنید."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }, [pk]);

  useEffect(() => {
    fetchPayment();
  }, [fetchPayment]);

  const formatDate = (iso) => {
    if (!iso) return "-";
    try {
      const d = new Date(iso);
      return d.toLocaleString("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="payment-page">
      <div className="payment-card" role="region" aria-live="polite">
        <div className="payment-header">
          <div className="payment-badge">
            {loading ? "در جریان..." : payment ? "نتیجه پرداخت" : "پرداخت"}
          </div>
          <h1 className="payment-title">نتیجهٔ تراکنش</h1>
          <div className="payment-glow" aria-hidden="true" />
        </div>

        <div className="payment-body">
          {/* پیام خطا / اطلاع */}
          {message && !payment && (
            <div
              className={`payment-note ${messageType === "error" ? "payment-error" : ""}`}
              role={messageType === "error" ? "alert" : "status"}
            >
              {messageType === "error" ? (
                <>
                  <div className="err-icon" aria-hidden="true">❌</div>
                  <div className="err-body">
                    <div className="err-title">مشکلی پیش آمد</div>
                    <div className="err-desc">{message}</div>
                    <div className="err-actions">
                      <button
                        className="btn-retry"
                        onClick={() => {
                          if (!loading) fetchPayment();
                        }}
                        disabled={loading}
                      >
                        {loading ? "در حال تلاش..." : "تلاش مجدد"}
                      </button>

                      <Link to="/" className="btn-back">بازگشت به صفحه اصلی</Link>
                    </div>
                  </div>
                </>
              ) : (
                <div>{message}</div>
              )}
            </div>
          )}

          {/* نمایش پرداخت موفق */}
          {payment ? (
            <>
              <div className="payment-row">
                <div className="payment-field">کاربر</div>
                <div className="payment-value">
                  {typeof payment.user === "string" ? payment.user : payment.user?.username ?? "-"}
                </div>
              </div>

              <div className="payment-row">
                <div className="payment-field">زمان پرداخت</div>
                <div className="payment-value payment-date">{formatDate(payment.paid_at)}</div>
              </div>

              <div className="payment-row">
                <div className="payment-field">شناسه پیگیری</div>
                <div className="payment-value payment-ref">{payment.ref_id}</div>
              </div>

              <div className="payment-row">
                <div className="payment-field">توضیحات</div>
                <div className="payment-value small">
                  {payment.detail ?? "پرداخت ثبت شد."}
                </div>
              </div>

              <div className="payment-actions">
                <Link to="/" className="btn back-button">بازگشت به صفحه اصلی</Link>
                <button
                  className="btn receipt-button"
                  onClick={() => window.print()}
                >
                  چاپ رسید
                </button>
              </div>
            </>
          ) : (
            !loading && !message && (
              <div className="payment-empty">
                <p>اطلاعاتی برای نمایش وجود ندارد.</p>
                <div className="payment-actions">
                  <Link to="/" className="btn back-button">بازگشت به صفحه اصلی</Link>
                </div>
              </div>
            )
          )}
        </div>

        <div className="payment-footer" aria-hidden="true">
          <span>Barber — تجربهٔ لوکس نوبت‌دهی</span>
          <div className="sparkles" />
        </div>
      </div>
    </div>
  );
};

 
export default Payment;
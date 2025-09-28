
import React, { useState } from "react";
import * as yup from "yup";
import axios from "axios";

export default function Comment() {
  const [comments, setComments] = useState({ description: "", point: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const schema = yup.object().shape({
    description: yup.string().required("کامنت الزامی است"),
    point: yup
      .number()
      .typeError("امتیاز باید عدد باشد")
      .required("امتیاز الزامی است")
      .min(1, "حداقل امتیاز 1 است")
      .max(5, "حداکثر امتیاز 5 است"),
  });

  const validate = async () => {
    try {
      const prepared = { ...comments, point: Number(comments.point) };
      const res = await schema.validate(prepared);
      return res;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    const result = await validate();
    if (!result) return;

    try {
      setLoading(true);
      await axios.post("http://localhost:8005/comment/", result);
      setMessage("نظر و امتیاز با موفقیت ارسال شد");
      setComments({ description: "", point: "" });
    } catch (err) {
      setError("خطایی رخ داد. لطفاً دوباره تلاش کنید");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cg-viewport" dir="rtl">
      <div className="cg-scene">
        <div className="cg-card" aria-live="polite">
          <header className="cg-header">
            <div>
              <h2 className="cg-title">نظرت را دربارهٔ آرایشگر بنویس</h2>
              <p className="cg-sub">کوتاه، صادقانه و بین 1 تا 5 امتیاز</p>
            </div>
            <div className="cg-score">★</div>
          </header>

          <form className="cg-form" onSubmit={handleSubmit}>
            {error && <div className="cg-msg cg-error">{error}</div>}
            {message && <div className="cg-msg cg-success">{message}</div>}

            <div className="cg-grid">
              <label className="cg-field">
                <span className="cg-label">امتیاز (1-5)</span>
                <input
                  className="cg-input"
                  type="number"
                  name="point"
                  min="1"
                  max="5"
                  value={comments.point}
                  onChange={(e) => setComments({ ...comments, point: e.target.value })}
                  placeholder="مثلاً: 5"
                />
              </label>

              <label className="cg-field cg-field-full">
                <span className="cg-label">کامنت</span>
                <textarea
                  className="cg-textarea"
                  name="description"
                  rows={4}
                  value={comments.description}
                  onChange={(e) => setComments({ ...comments, description: e.target.value })}
                  placeholder="تجربهٔ خود را بنویسید..."
                />
              </label>
            </div>

            <div className="cg-actions">
              <button className="cg-btn cg-submit" type="submit" disabled={loading}>
                {loading ? "در حال ارسال..." : "ارسال نظر"}
              </button>

              <button
                type="button"
                className="cg-btn cg-ghost"
                onClick={() => {
                  setComments({ description: "", point: "" });
                  setError("");
                  setMessage("");
                }}
              >
                پاک کردن
              </button>
            </div>

            <div className="cg-foot">با تشکر — بازخورد شما ارزشمند است</div>
          </form>
        </div>

        {/* تزیین محیطی — لایه‌های شفاف شناور برای حس سه‌بعدی */}
        <div className="cg-glow cg-glow-1" aria-hidden="true" />
        <div className="cg-glow cg-glow-2" aria-hidden="true" />
      </div>
    </div>
  );
}
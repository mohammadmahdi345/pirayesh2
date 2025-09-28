import React, { useEffect, useState } from "react";
import axios from "axios";

const CommentAllStats = () => {
    const [data, setData] = useState({ average_point: 0, comments: [] });
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get("http://localhost:8005/comment/admin/all/");
                setData(response.data);
                setMessage("میانگین و نظرات بارگذاری شدند");
            } catch (error) {
                setMessage("خطا در بارگذاری آمار");
                console.error(error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="admin-stats-page">
            <header className="stats-header">
            <h2 className="stats-title">📊 آمار کلی نظرات</h2>
            <div className="avg-badge">⭐ میانگین: <span className="avg-value">{data.average_point}</span></div>
            </header>

            <section className="stats-body">
            <div className="all-comments-card">
                <h3 className="card-title">💬 همه‌ی نظرات</h3>
                <ul className="all-comments-list">
                {data.comments.map((c) => (
                    <li key={c.id} className="comment-row">
                    <div className="comment-main">
                        <p className="comment-text">{c.description}</p>
                        <div className="comment-meta">
                        <span className="meta-point">امتیاز: <strong>{c.point}</strong></span>
                        <span className="meta-user">کاربر: <strong>{c.user}</strong></span>
                        <span className="meta-date">{new Date(c.created_at).toLocaleString()}</span>
                        </div>
                    </div>
                    </li>
                ))}
                </ul>
                <div className="card-footer">{message && <div className="muted-msg">{message}</div>}</div>
            </div>
            </section>
        </div>
    );
};

export default CommentAllStats;

import React, { useEffect, useState } from "react";
import axios from "axios";

const CommentStats = () => {
    const [comments, setComments] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchstat = async () => {
            try {
                const response = await axios.get("http://localhost:8005/comment/admin/");
                setComments(response.data);
                setMessage("کامنت‌ها بارگذاری شدند");
            } catch (error) {
                setMessage("خطا در بارگذاری کامنت‌ها");
                console.error(error);
            }
        };
        fetchstat();
    }, []);

    return (
        <div className="admin-stats-page">
            <header className="stats-header">
            <h2 className="stats-title">👥 امتیازات و نظرات کاربران</h2>
            </header>

            <section className="stats-grid">
            {comments.map((s) => (
                <article key={s.user_id} className="stats-card">
                <div className="user-card">
                    <div className="user-avatar" aria-hidden="true">
                    {s.username?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="user-info">
                    <h3 className="user-name">{s.username}</h3>
                    <div className="user-average">⭐ {s.avarage_point}</div>
                    </div>
                </div>

                <div className="user-comments">
                    {s.comments.map((c, i) => (
                    <div key={i} className="comment-item">
                        <p className="comment-text">{c.comment}</p>
                        <div className="comment-meta">
                        <span className="meta-point">
                            امتیاز: <strong>{c.point}</strong>
                        </span>
                        <span className="meta-date">
                            {new Date(c.created_at).toLocaleString()}
                        </span>
                        </div>
                    </div>
                    ))}
                </div>
                </article>
            ))}
            </section>

            <footer className="status-line">
            {message && <div className="muted-msg">{message}</div>}
            </footer>
        </div>
        );


};

export default CommentStats;

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
        <div>
            <h2>📊 آمار کلی نظرات</h2>
            <p>⭐ میانگین کلی امتیازات: <b>{data.average_point}</b></p>

            <h3>💬 همه‌ی نظرات:</h3>
            <ul>
                {data.comments.map((c) => (
                    <li key={c.id} style={{ marginBottom: "15px", borderBottom: "1px solid #ccc" }}>
                        <p>{c.description}</p>
                        <small>
                            امتیاز: {c.point} | کاربر: {c.user} | تاریخ:{" "}
                            {new Date(c.created_at).toLocaleString()}
                        </small>
                    </li>
                ))}
            </ul>

            <h4>{message}</h4>
        </div>
    );
};

export default CommentAllStats;

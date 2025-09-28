import React, { Component } from 'react';
import axios from 'axios';

class Home extends Component {
  state = {
    hall: null,
    error: "",
  };

  componentDidMount() {
    this.fetchhome();
  }

  fetchhome = async () => {
    try {
      const response = await axios.get("http://localhost:8005/hall/");
      this.setState({ hall: response.data, error: "" });
    } catch (error) {
      this.setState({ error: "خطا در دریافت اطلاعات" });
      console.error(error);
    }
  };

  render() {
    const { hall, error } = this.state;

    return (
      <div className="home-page">
        <div className="home-layer">
          <h1 className="hall-heading">اطلاعات سالن</h1>
          {error && <p className="hall-error">{error}</p>}

          {hall ? (
            <div className="hall-card">
              <h2 className="hall-title">{hall.name}</h2>
              <p className="hall-info">{hall.info}</p>

              <div className="hall-meta">
                <p className="hall-address">
                  <strong>آدرس:</strong> {hall.address}
                </p>
                <p className="hall-phone">
                  <strong>شماره تماس:</strong> {hall.phone_number}
                </p>
                <p className="hall-hours">
                  <strong>ساعت کاری:</strong>
                  <span className="time">
                    {" "}
                    {hall.open_time} - {hall.close_time}
                  </span>
                </p>
                <p
                  className={`hall-status ${hall.closed ? "closed" : "open"}`}
                >
                  وضعیت: {hall.closed ? "بسته" : "باز"}
                </p>
              </div>

              {hall.images && hall.images.length > 0 && (
                <div className="hall-images" aria-label="گالری تصاویر سالن">
                  <h3 className="images-title">📷 تصاویر سالن</h3>
                  <div className="images-grid">
                    {hall.images.map((img) => (
                      <figure key={img.id} className="hall-image-wrap">
                        <img
                          className="hall-image"
                          src={img.image} // ✅ مستقیم URL
                          alt={`hall-${img.id}`}
                        />
                        <figcaption className="img-caption">
                          تصویر {img.id}
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            !error && <p className="hall-loading">در حال بارگذاری...</p>
          )}
        </div>
        <div className="home-waves" aria-hidden="true">
          <div className="wave"></div>
          <div className="wave"></div>
          <div className="wave"></div>
        </div>
      </div>
    );
  }
}

export default Home;
import React, { Component } from 'react';
import axios from 'axios';

class Home extends Component {
  state = {
    hall: null,
    error: ''
  };

  componentDidMount() {
    this.fetchhome();
  }

  fetchhome = async () => {
    try {
      const response = await axios.get('http://localhost:8005/hall/');
      this.setState({ hall: response.data });
    } catch (error) {
      this.setState({ error: "خطا در دریافت اطلاعات" });
      console.error(error);
    }
  };

  render() {
    const { hall, error } = this.state;

    return (
      <div>
        <h1>اطلاعات سالن</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        {hall ? (
          <div>
            <h2>{hall.name}</h2>
            <p>{hall.info}</p>
            <p>آدرس: {hall.address}</p>
            <p>شماره تماس: {hall.phone_number}</p>
            <p>
              ساعت کاری: {hall.open_time} - {hall.close_time}
            </p>
            <p>وضعیت: {hall.closed ? "بسته" : "باز"}</p>

            {hall.images && hall.images.length > 0 && (
              <div>
                <h3>تصاویر:</h3>
                {hall.images.map((img, i) => (
                  <img key={i} src={img.image} alt={`hall-${i}`} width="200" />
                ))}
              </div>
            )}
          </div>
        ) : (
          <p>در حال بارگذاری...</p>
        )}
      </div>
    );
  }
}

export default Home;

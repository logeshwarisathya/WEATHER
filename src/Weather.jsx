import React, { useEffect, useState } from "react";

const apiKey = "9d8cd23a62339c290c09673fd03df8e8";

const Weather = () => {
  const [today, setToday] = useState(null);
  const [tomorrow, setTomorrow] = useState(null);
  const [yesterday, setYesterday] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      fetchToday(lat, lon);
      fetchTomorrow(lat, lon);
      fetchYesterday(lat, lon); // From Open-Meteo (free)
    });
  }, []);

  // TODAY (OpenWeather)
  const fetchToday = async (lat, lon) => {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );
    const data = await res.json();
    setToday(data);
  };

  // TOMORROW (OpenWeather Forecast)
  const fetchTomorrow = async (lat, lon) => {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );
    const data = await res.json();
    setTomorrow(data.list[8]); // 24 hours later (3-hour intervals)
  };

  // YESTERDAY (Open-Meteo – Free API)
  const fetchYesterday = async (lat, lon) => {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&past_days=1&hourly=temperature_2m`
    );

    const data = await res.json();

    // last temperature from yesterday
    const temps = data.hourly.temperature_2m;
    const yesterdayTemp = temps[temps.length - 1];

    setYesterday({
      temp: yesterdayTemp,
      weather: [{ main: "Mist" }],
    });
  };

  return (
    <div className="temp">

      {yesterday && (
        <div className="yesterday">
          <h2>Yesterday</h2>
          <p>Temperature: {yesterday.temp}°C</p>
          <p>Weather: {yesterday.weather[0].main}</p>
        </div>
      )}

      {today && (
        <div className="today">
          <h2>Today</h2>
          <p>Temperature: {today.main.temp}°C</p>
          <p>Weather: {today.weather[0].main}</p>
        </div>
      )}

      {tomorrow && (
        <div className="tomorrow">
          <h2>Tomorrow</h2>
          <p>Temperature: {tomorrow.main.temp}°C</p>
          <p>Weather: {tomorrow.weather[0].main}</p>
        </div>
      )}
      
    </div>
  );
};

export default Weather;

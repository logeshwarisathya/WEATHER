import React, { useState, useEffect } from "react";
import './index.css';
import { CiSearch } from "react-icons/ci";

import DefaultImg from "./Assets/weather.jpg";
import Rainy from "./Assets/Rainy.mp4";
import ClearSky from "./Assets/ClearSky.mp4";
import Cloudy from "./Assets/Cloudy.mp4";
import Drizzle from "./Assets/Drizzle.mp4";
import Fog from "./Assets/Fog.mp4";
import Snow from "./Assets/Snow.mp4";
import Thunder from "./Assets/Thunder.mp4";

const apiKey = "9d8cd23a62339c290c09673fd03df8e8";

const App = () => {
  const [city, setCity] = useState("");
  const [inputWeather, setInputWeather] = useState(null);
  const [defaultToday, setDefaultToday] = useState(null);
  const [defaultTomorrow, setDefaultTomorrow] = useState(null);
  const [defaultYesterday, setDefaultYesterday] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // -------------------- Fetch Weather for Search City --------------------
  const fetchWeather = async () => {
    if (!city) return;
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      const data = await res.json();

      if (data.cod && data.cod !== 200) {
        setErrorMessage("City not found! Please enter a valid city name.");
        setInputWeather(null);
        return;
      }

      setErrorMessage("");
      const { lat, lon } = data.coord;

      fetchToday(lat, lon, true);
      fetchTomorrow(lat, lon, true);
      fetchYesterday(lat, lon, true);
    } catch (err) {
      console.error("Error fetching city weather:", err);
      setErrorMessage("Something went wrong! Try again.");
      setInputWeather(null);
    }
  };

  // -------------------- Fetch Location Based Weather --------------------
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        fetchToday(lat, lon);
        fetchTomorrow(lat, lon);
        fetchYesterday(lat, lon);
      },
      () => console.log("Location Blocked")
    );
  }, []);

  // -------------------- Fetch Today --------------------
  const fetchToday = async (lat, lon, isInput = false) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );
      const data = await res.json();
      if (isInput) setInputWeather(data);
      else setDefaultToday(data);
    } catch (err) {
      console.error("Error fetching today:", err);
    }
  };

  // -------------------- Fetch Tomorrow --------------------
  const fetchTomorrow = async (lat, lon, isInput = false) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );
      const data = await res.json();
      if (isInput) setInputWeather((prev) => ({ ...prev, tomorrow: data.list[8] }));
      else setDefaultTomorrow(data.list[8]);
    } catch (err) {
      console.error("Error fetching tomorrow:", err);
    }
  };

  // -------------------- Fetch Yesterday --------------------
  const fetchYesterday = async (lat, lon, isInput = false) => {
    try {
      const yesterdayDate = new Date();
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);

      const yyyy = yesterdayDate.getFullYear();
      const mm = String(yesterdayDate.getMonth() + 1).padStart(2, "0");
      const dd = String(yesterdayDate.getDate()).padStart(2, "0");
      const dateStr = `${yyyy}-${mm}-${dd}`;

      const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${dateStr}&end_date=${dateStr}&hourly=temperature_2m&timezone=auto`;

      const res = await fetch(url);
      const data = await res.json();
      const temps = data.hourly.temperature_2m;
      const yesterdayTemp = temps[temps.length - 1];

      if (isInput) setInputWeather((prev) => ({ ...prev, yesterday: { temp: yesterdayTemp } }));
      else setDefaultYesterday({ temp: yesterdayTemp });
    } catch (err) {
      console.error("Error fetching yesterday:", err);
      if (!isInput) setDefaultYesterday({ temp: "N/A" });
    }
  };

  // -------------------- Current Date and Time --------------------
  const currentDate = new Date();
  const dateString = currentDate.toLocaleDateString();
  const timeString = currentDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // -------------------- Decide which data to show --------------------
  const showData = inputWeather ? inputWeather : defaultToday;
  const showYesterday = inputWeather?.yesterday ?? defaultYesterday;
  const showTomorrow = inputWeather?.tomorrow ?? defaultTomorrow;

  // -------------------- Background Logic (like ShowData component) --------------------
  const getBackground = (data) => {
    const id = data?.weather?.[0]?.id ?? 0;
    if (id >= 200 && id < 300) return { type: "video", src: Thunder };
    if (id >= 300 && id < 400) return { type: "video", src: Drizzle };
    if (id >= 500 && id < 600) return { type: "video", src: Rainy };
    if (id >= 600 && id < 700) return { type: "video", src: Snow };
    if (id >= 700 && id < 800) return { type: "video", src: Fog };
    if (id === 800) return { type: "video", src: ClearSky };
    if (id > 800 && id < 900) return { type: "video", src: Cloudy };
    return { type: "image", src: DefaultImg };
  };

  const background = getBackground(showData);

  return (
    <div className="Input-wrapper">
      {/* Background */}
      <div className="Showdata-Content">
        {background.type === "video" ? (
          <video
            key={background.src}
            autoPlay
            loop
            muted
            playsInline
            className="img"
          >
            <source src={background.src} type="video/mp4" />
          </video>
        ) : (
          <img className="img" src={background.src} alt="default weather" />
        )}
      </div>

      {/* Search Box + Weather Info */}
      <div className="Input-content">
        <div className="input-box">
          <input
            type="text"
            placeholder="Enter City Name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button onClick={fetchWeather}>
            <CiSearch />
          </button>
        </div>

        {errorMessage && <p className="error">{errorMessage}</p>}

        {showData && (
          <>
            {/* Default values + Searched City */}
            {inputWeather && (
              <div className="inputdata">
                <h3>{showData.name}</h3>
                <p>{showData.weather[0].main}</p>
                <p>{showData.main.temp}°C</p>
              </div>
            )}

            <div className="datetime">
              <p>{dateString}</p>
              <p>{timeString}</p>
            </div>

            <div className="temp">
              {showYesterday && (
                <div className="yesterday">
                  <h2>Yesterday</h2>
                  <p>{showYesterday.temp}°C</p>
                </div>
              )}
              {showData && (
                <div className="today">
                  <h2>Today</h2>
                  <p>{showData.main.temp}°C</p>
                  <p>{showData.weather[0].main}</p>
                </div>
              )}
              {showTomorrow && (
                <div className="tomorrow">
                  <h2>Tomorrow</h2>
                  <p>{showTomorrow.main.temp}°C</p>
                  <p>{showTomorrow.weather[0].main}</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;

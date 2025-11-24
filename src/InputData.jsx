import React, { useState } from 'react'
import { CiSearch } from "react-icons/ci";
import ShowData from './ShowData';
import Weather from './Weather';

const InputData = () => {
    const [city, setCity] = useState("");
    const [weatherData, setWeatherData] = useState(null);
    const apiKey = "9d8cd23a62339c290c09673fd03df8e8";

    const fetchWeather = async () => {
        let weather = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        let finalData = await weather.json();
        setWeatherData(finalData);
    };

    return (
        <div className="Input-wrapper">
            
            {/* Background Image / Video */}
            <ShowData data={weatherData} />

            {/* Transparent Centered Box */}
            <div className="Input-content">
                <div className="input-box">
                    <input 
                    placeholder='Enter City Name'
                        type="text" 
                        id="city" 
                        onChange={(e) => setCity(e.target.value)} 
                    />
                    <button onClick={fetchWeather}><CiSearch /></button>

                    {/* Temperature Data Below Input */}
                    <Weather />
                </div>
            </div>

        </div>
    )
}

export default InputData;

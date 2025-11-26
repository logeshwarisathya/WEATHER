import React from 'react'
import DefaultImg from './Assets/weather.jpg'
import Rainy from './Assets/Rainy.mp4'
import ClearSky from './Assets/ClearSky.mp4'
import Cloudy from './Assets/Cloudy.mp4'
import Drizzle from './Assets/Drizzle.mp4'
import Fog from './Assets/Fog.mp4'
import Snow from './Assets/Snow.mp4'
import Thunder from './Assets/Thunder.mp4'



const ShowData = ({data}) => {
    console.log(data)
    // const id = data?.weather[0].id
    const id = data?.weather?.[0]?.id ?? 0;

let background = {
    type: "image",
    src: DefaultImg
};

// Thunderstorm
if (id >= 200 && id < 300) {
    background = { type:"video/mp4", src: Thunder };
}
// Drizzle
else if (id >= 300 && id < 400) {
    background = { type:"video/mp4", src: Drizzle };
}
// Rain
else if (id >= 500 && id < 600) {
    background = { type:"video/mp4", src: Rainy };
}
// Snow
else if (id >= 600 && id < 700) {
    background = { type:"video/mp4", src: Snow };
}
// Atmosphere (Fog, Mist, Haze, Smoke)
else if (id >= 700 && id < 800) {
    background = { type:"video/mp4", src: Fog };
}
// Clear
else if (id === 800) {
    background = { type:"video/mp4", src: ClearSky };
}
// Clouds
else if (id > 800 && id < 900) {
    background = { type:"video/mp4", src: Cloudy };
}

  return (
    <div className="Showdata-Content">

        {background.type==='video/mp4'?(
            <video
  key={background.src}
  autoPlay
  loop
  muted
  playsInline
  className="weather-bg"
>
  <source src={background.src} type="video/mp4" />
</video>
        ):(
            <img className='img' src={background.src}
            alt="default weather"
        />
        )}

        

        <div className='weatherContent'>
            <h3>{data?.name}</h3>
            <p>{data?.weather[0].main}</p>
            <p>{data?.main.temp}</p>
            {/* <img src={`https://openweathermap.org/img/wn/${icon}@2x.png`} alt=""  /> */}
        </div>
    </div>
    
  )
}

export default ShowData
import { useState } from "react";
import sunny from "../assets/images/Sunny.jpg";
import cloudy from "../assets/images/Cloudy.jpg";
import rainy from "../assets/images/Rainy.jpg";
import snowy from "../assets/images/snow.jpg";
import fog from "../assets/images/fog.jpg";
import stormy from "../assets/images/Stormy.jpg";
import loadingGif from "../assets/images/loading.gif";
import { useRef } from "react";
import { useEffect } from "react";

const WeatherApp = () => {
  const api_key = "f5b6f1df37baccc3785b18852d460733";
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDefaultWeather = async () => {
      setLoading(true);
      const defaultCity = "London";
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${defaultCity}&units=Metric&appid=${api_key}`;
      try {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error("Failed to fetch default weather data");
        }
        const data = await res.json();
        setWeather({
          icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
          temp: data.main.temp,
          city: data.name,
          humidity: data.main.humidity,
          speed: data.wind.speed,
          condition: data.weather[0].main,
          timezone: data.timezone,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDefaultWeather();

    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, [api_key]);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const localDate = new Date(currentDate.getTime() + weather.timezone * 1000);
  const dayOfWeek = daysOfWeek[currentDate.getUTCDay()];
  const month = months[currentDate.getUTCMonth()];
  const dayOfMonth = currentDate.getUTCDate();
  const hours = String(localDate.getUTCHours()).padStart(2, "0");
  const minutes = String(localDate.getUTCMinutes()).padStart(2, "0");
  const seconds = String(localDate.getUTCSeconds()).padStart(2, "0");

  const formattedDate = ` ${dayOfWeek}, ${dayOfMonth} ${month}`;
  const formattedTime = ` ${hours}:${minutes}:${seconds}`;

  const cityInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    let city = e.target.city.value;

    if (!city) {
      alert("Please frovide valid city name");
      return;
    }
    setLoading(true);
    setWeather({});
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=Metric&appid=${api_key}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error("City not found");
        }

        return res.json();
      })
      .then((data) => {
        setWeather({
          icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
          temp: data.main.temp,
          city: data.name,
          humidity: data.main.humidity,
          speed: data.wind.speed,
          condition: data.weather[0].main,
          timezone: data.timezone,
        });
        cityInputRef.current.value = "";
      })
      .catch((error) => {
        console.error(error);
        setWeather({ notFound: true });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const backgroundImages = {
    Clear: sunny,
    Clouds: cloudy,
    Rain: rainy,
    Snow: snowy,
    Haze: stormy,
    Mist: fog,
  };
  const backgroundImage = backgroundImages[weather.condition] || "";
  return (
    <div
      className="container-fluid min-vh-100 d-flex align-items-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className=" mx-auto border rounded  text-center text-white p-4"
        style={{
          backgroundColor: "#3B5FAB",
          width: "400px",
          minHeight: "520px",
        }}
      >
        <h1 className="fw-bold mb-5">Weather Forecast App</h1>

        <form className="d-flex mb-2" onSubmit={handleSubmit}>
          <input
            className="form-control me-2"
            placeholder="Enter City .."
            name="city"
            ref={cityInputRef}
          />
          <button className="btn btn-outline-light" type="submit">
            Search
          </button>
        </form>

        {loading ? (
          <img
            src={loadingGif}
            alt="Loading..."
            className="m-auto mt-5 loader"
          />
        ) : weather.notFound ? (
          <>
            <div className="not-found">City Not Found 😒</div>
            <div>Please search for a right city to get weather details.</div>
          </>
        ) : (
          weather.city && (
            <>
              <img
                className="m-auto mt-2"
                src={weather.icon}
                alt="Weather Icon"
              />
              <h3 className="mb-3">{weather.condition}</h3>
              <h1 className="display-1 fw-bold">
                {Math.floor(weather.temp)}°C
              </h1>
              <h1 className="mb-2">
                <i className="bi bi-geo-alt"></i> {weather.city}
              </h1>
              <h4 className="mb-5">
                <p>
                  <i className="bi bi-calendar"></i>
                  {formattedDate}
                </p>
                <p>
                  <i className="bi bi-clock"></i>
                  {formattedTime}
                </p>
              </h4>

              <div className="row mt-5">
                <div className="col">
                  <i className="bi bi-water"></i> Humidity <br />{" "}
                  {weather.humidity}%
                </div>
                <div className="col">
                  <i className="bi bi-wind"></i> Wind Speed <br />{" "}
                  {weather.speed} km/h
                </div>
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
};

export default WeatherApp;

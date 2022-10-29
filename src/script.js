let today = new Date();
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let day = days[today.getDay()];
let hours = today.getHours();
if (hours < 10) {
  hours = `0${hours}`;
}
let minutes = today.getMinutes();
if (minutes < 10) {
  minutes = `0${minutes}`;
}
let time = `${hours}:${minutes}`;
let currentDayTime = document.querySelector("#day-and-time");
currentDayTime.innerHTML = `${day} | ${time}`;

// Main Temperature Data and Home Button

function formatDate(timestamp) {
  let time = new Date(timestamp);
  let sunHour = time.getHours();
  if (sunHour < 10) {
    sunHour = `0${sunHour}`;
  }
  let sunMinute = time.getMinutes();
  if (sunMinute < 10) {
    sunMinute = `0${sunMinute}`;
  }
  return `${sunHour}:${sunMinute}`;
}

function formatForecastDate(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 4) {
      forecastHTML =
        forecastHTML +
        `<div class="col-3 next-days">
        <div class="weather-date">${formatForecastDate(forecastDay.dt)}</div>
        <img
          src="images/${forecastDay.weather[0].icon}.png"
          alt="Sun"
          width="45px"
          class="forecast-icon"
        />
        <div class="weather-forecast-temp">
          <span class="forecast-min"> ${Math.round(
            forecastDay.temp.min
          )}º</span>
          <span class="forecast-max"><strong>${Math.round(
            forecastDay.temp.max
          )}</strong>º</span>
        </div>
      </div>
  `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = `97f8e93f00107773f88eafd933ce86b7`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayForecast);
}

function displayTemperature(response) {

  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#current-city");
  let countryElement = document.querySelector("#country");
  let minTempElement = document.querySelector("#min-temp");
  let maxTempElement = document.querySelector("#max-temp");
  let tempDescriptionElement = document.querySelector(".temp-description");
  let windElement = document.querySelector(".wind-speed");
  let humidityElement = document.querySelector(".humidity");
  let iconElement = document.querySelector(".main-temp-img");
  let sunriseElement = document.querySelector("#sunrise-time");
  let sunsetElement = document.querySelector("#sunset-time");

  celsiusTemp = response.data.main.temp;

  temperatureElement.innerHTML = `${Math.round(response.data.main.temp)}º`;
  cityElement.innerHTML = response.data.name;
  countryElement.innerHTML = response.data.sys.country;
  minTempElement.innerHTML = `${Math.round(response.data.main.temp_min)}º`;
  maxTempElement.innerHTML = `${Math.round(response.data.main.temp_max)}º`;
  tempDescriptionElement.innerHTML = response.data.weather[0].description;
  windElement.innerHTML = `${Math.round(response.data.wind.speed * 3.6)}`;
  humidityElement.innerHTML = response.data.main.humidity;
  iconElement.setAttribute("src", `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
  iconElement.setAttribute("alt", response.data.weather[0].description);



  sunriseElement.innerHTML = formatDate(response.data.sys.sunrise * 1000);
  sunsetElement.innerHTML = formatDate(response.data.sys.sunset * 1000);

  getForecast(response.data.coord);
}

function search(city) {
  let apiKey = `6914b599dae34153d2187249330170b1`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayTemperature);
}

function getCity(event) {
  event.preventDefault();
  let searchCity = document.querySelector("#search-form-container");
  search(searchCity.value);
}

search(`Lagos`);

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", getCity);

function showCurrentTemp(response) {
  // console.log(response);
  let latitude = response.coords.latitude;
  let longitude = response.coords.longitude;
  let units = `metric`;
  let apiKey = `6914b599dae34153d2187249330170b1`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(displayTemperature);
}

function getCurrentPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showCurrentTemp);
}

let homeButton = document.querySelector("#home");
homeButton.addEventListener("click", getCurrentPosition);
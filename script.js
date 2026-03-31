const API_KEY = "177e09fe8343d0a917826c5564c292c8";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const unitToggle = document.getElementById("unitToggle");
const message = document.getElementById("message");

const weatherResult = document.getElementById("weatherResult");
const cityName = document.getElementById("cityName");
const weatherIcon = document.getElementById("weatherIcon");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");

const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

let currentUnit = "metric"; // metric = °C, imperial = °F
let lastCity = ""; 

function showMessage(text, type = "info") {
  message.textContent = text;

  if (type === "error") {
    message.style.color = "red";
  } else if (type === "success") {
    message.style.color = "green";
  } else {
    message.style.color = "#555";
  }
}

function setLoading(isLoading) {
  searchBtn.disabled = isLoading;
  locationBtn.disabled = isLoading;
  searchBtn.textContent = isLoading ? "Loading..." : "Search";
}

async function getWeatherByCity(city) {
  if (city.trim() === "") {
    showMessage("Please enter a city name.", "error");
    return;
  }

  lastCity = city;
  setLoading(true);
  showMessage("Fetching weather...");
  weatherResult.classList.add("hidden");

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${currentUnit}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("City not found.");
    }

    const data = await response.json();
    displayWeather(data);
    saveSearch(city);
    renderHistory();
    showMessage("Weather loaded successfully!", "success");
  } catch (error) {
    showMessage(error.message, "error");
  } finally {
    setLoading(false);
  }
}

async function getWeatherByCoords(lat, lon) {
  setLoading(true);
  showMessage("Fetching weather for your location...");
  weatherResult.classList.add("hidden");

  try
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${currentUnit}`;
    const response = await fetch(url);
  
    if (!response.ok) {
      throw new Error("City not fetch weather for your location");
    }

    const data = await response.json();

    lastCity = data.name;
    saveSearch(data.name);
    displayWeather(data);
    saveSearch(data.name);
    renderHistory();
    showMessage("Weather loaded successfully!", "success");
  } catch (error) {
    showMessage(error.message, "error");
  } finally {
    setLoading(false);
  }
}

function displayWeather(data) {
  cityName.textContent = `${data.name}, ${data.sys.country}`;

  const tempUnit = currentUnit === "metric" ? "°C" : "°F";
  const speedUnit = currentUnit === "metric" ? "m/s" : "mph";

  temperature.textContent = `Temperature: ${Math.round(data.main.temp)}${tempUnit}`;
  description.textContent = `Condition: ${data.weather[0].description}`;
  feelsLike.textContent = `Feels Like: ${Math.round(data.main.feels_like)}${tempUnit}`;
  humidity.textContent = `Humidity: ${data.main.humidity}%`;
  wind.textContent = `Wind Speed: ${data.wind.speed}${speedUnit}`;

  const iconCode = data.weather[0].icon;
  weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  weatherIcon.alt = data.weather[0].description;

  weatherResult.classList.remove("hidden");
}

function saveSearch(city) {
  let history = JSON.parse(localStorage.getItem("weatherSearchHistory")) || [];

  city = city.trim();

  history = history.filter(item => item.toLowerCase() !== city.toLowerCase());
  history.unshift(city);

  if (history.length > 5) {
    history = history.slice(0, 5);
  }

  localStorage.setItem("weatherHistory", JSON.stringify(history));
}



function renderHistory() {
  const history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
  historyList.innerHTML = "";

  history.forEach((city) => {
    const li = document.createElement("li");
    li.textContent = city;
    li.addEventListener("click", () => {
      cityInput.value = city;
      getWeatherByCity(city);
    });
    historyList.appendChild(li);
  });
}

function clearHistory() {
  localStorage.removeItem("weatherHistory");
  renderHistory();
  showMessage("Search history cleared.", "info");
}

function toggleUnit() {
  if (currentUnit === "metric") {
    currentUnit = "imperial";
    unitToggle.textContent = "Switch to °C";
  } else {
    currentUnit = "metric";
    unitToggle.textContent = "Switch to °F";
  }

  if (lastCity) {
    getWeatherByCity(lastCity);
  }
}

function useMyLocation() {
  if (navigator.geolocation) {
    showMessage("Geolocation is not supported by your browser.", "error");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      getWeatherByCoords(latitude, longitude);
    },
    () => {
      showMessage("Unable to retrieve your location.", "error");
    }
  );
}

searchBtn.addEventListener("click", () => {
  getWeather(cityInput.value);
});

cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    getWeatherByCity(cityInput.value);
  }
});

locationBtn.addEventListener("click", useMyLocation);
unitToggle.addEventListener("click", toggleUnit);
clearHistoryBtn.addEventListener("click", clearHistory);

renderHistory();

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherResults = document.getElementById("weatherResults");
const cityName = document.getElementById("cityName");
const weatherIcon = document.getElementById("weatherIcon");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const errorMessage = document.getElementById("errorMessage");

const API_KEY = "177e09fe8343d0a917826c5564c292c8";

function showWeather(data) {
    cityName.textContent = data.name;
    temperature.textContent = `Temperature: ${Math.round(data.main.temp)}°C`;
    description.textContent = `Condition: ${data.weather[0].description}`;

    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIcon.alt = data.weather[0].description;

    weatherResults.classList.remove("hidden");
    errorMessage.classList.add("hidden");
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove("hidden");
    weatherResults.classList.add("hidden");
}

async function getWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("City not found. Please try again.");

        }

        const data = await response.json();
        showWeather(data);
    } catch (error) {
        showError(error.message);
    }
}

function handleSearch() {
    const city = cityInput.value.trim();

    if (city === "") {
        showError("Please enter a city name.");
        return;
    }

    getWeather(city);
}

searchBtn.addEventListener("click", handleSearch);

cityInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        handleSearch();
    }
});

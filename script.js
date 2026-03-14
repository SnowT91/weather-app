const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherResult = document.getElementById("weatherResult");
const cityName = document.getElementById("cityName");
const weatherIcon = document.getElementById("weatherIcon");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const errorMessage = document.getElementById("errorMessage");

function showWeather(data) {
  cityName.textContent = data.city;
  temperature.textContent = `Temperature: ${data.temp}°C`;
  description.textContent = `Condition: ${data.description}`;
  weatherIcon.src = data.icon;
  weatherIcon.alt = data.description;

  weatherResult.classList.remove("hidden");
  errorMessage.classList.add("hidden");
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
  weatherResult.classList.add("hidden");
}

function handleSearch() {
  const city = cityInput.value.trim();

  if (city === "") {
    showError("Please enter a city name.");
    return;
  }

  // Temporary demo data before API connection
  showWeather({
    city: city,
    temp: 20,
    description: "Clear sky",
    icon: "https://openweathermap.org/img/wn/01d@2x.png",
  });
}

searchBtn.addEventListener("click", handleSearch);

cityInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleSearch();
  }
});
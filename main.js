// Importing the cities variable
import { cities } from "./cities.js";

// Selecting elements from HTML
var selectElement = document.getElementById("mySelect");
var parent = document.getElementById("forecastContainer");
var loading = document.querySelector(".loading");

// Function to retrieve city names and display them as options
function retrievingCities() {
    // Adding the default "Select a city" option
    var defaultOption = document.createElement('option');
    defaultOption.value = "";
    defaultOption.text = "Select a city";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    selectElement.appendChild(defaultOption);

    for (var key in cities) {
        var citiesData = cities[key];
        for (var i = 0; i < citiesData.length; i++) {
            var option = document.createElement('option');
            option.value = `${citiesData[i].name},${citiesData[i].longitude},${citiesData[i].latitude}`;
            option.text = `${citiesData[i].name}, ${key}`;
            selectElement.appendChild(option);
        }
    }
}

// Calling the retrievingCities function to make the dropdown functional
retrievingCities();

// Event to fetch weather data when a city is selected
selectElement.addEventListener('change', function () {
    loading.style.display = "block";
    var selectedValue = selectElement.value;
    if (selectedValue) {
        var [cityName, longitude, latitude] = selectedValue.split(",");
        citiesFetch(longitude, latitude);
    }
});

// Function to fetch weather data from the 7timer API
function citiesFetch(longitude, latitude) {
    fetch(`https://www.7timer.info/bin/api.pl?lon=${longitude}&lat=${latitude}&product=civillight&output=json`)
        .then(response => response.json())
        .then(data => {
            loading.style.display = "none";
            parent.innerHTML = ""; // Clear previous forecast cards

            data.dataseries.forEach((dataseries, index) => {
                if (index < 7) { // Limit to 7 days
                    var forecastCard = document.createElement("div");
                    forecastCard.classList.add("forecastCard");

                    // Date
                    var dateValue = readableDate(dataseries.date);
                    var dateObject = new Date(dateValue);
                    var d = dateObject.toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    });
                    
                    
                    var dateElem = document.createElement("p");
                    dateElem.classList.add("date");
                    dateElem.textContent = d;
                    forecastCard.appendChild(dateElem);

                    
                    var imgElem = document.createElement("img");
                    imgElem.classList.add("img");
                    imgElem.src = getWeatherImage(dataseries.weather);
                    forecastCard.appendChild(imgElem);

                    // Weather (human-readable format)
                    var weatherElem = document.createElement("p");
                    weatherElem.classList.add("weather");
                    weatherElem.textContent = getHumanReadableWeather(dataseries.weather);
                    forecastCard.appendChild(weatherElem);

                    // Max Temperature
                    var maxElem = document.createElement("p");
                    maxElem.classList.add("max");
                    maxElem.textContent = "High: " + dataseries.temp2m.max + "°C";
                    forecastCard.appendChild(maxElem);

                    // Min Temperature
                    var minElem = document.createElement("p");
                    minElem.classList.add("min");
                    minElem.textContent = "Low: " + dataseries.temp2m.min + "°C";
                    forecastCard.appendChild(minElem);

                    // Append the forecast card to the parent container
                    parent.appendChild(forecastCard);
                }
            });

            // Display the container
            parent.style.display = "flex";
            parent.style.justifyContent = "center";
        })
        .catch(error => {
            console.error('Fetch error:', error);
            loading.style.display = "none";
        });
}

// Function to convert date number to readable date
function readableDate(dateNumber) {
    var d = dateNumber.toString();
    var year = d.substring(0, 4);
    var month = d.substring(4, 6);
    var day = d.substring(6, 8);
    return `${year}-${month}-${day}`;
}

// Function to get the appropriate weather image based on weather condition
function getWeatherImage(weather) {
    var weatherImages = {
        "humid": "images/humid.png",
        "windy": "images/windy.png",
        "clear": "images/clear.png",
        "cloudy": "images/vcloudy.png",
        "fog": "images/fog.png",
        "ishower": "images/ishower.png",
        "lightrain": "images/lightrain.png",
        "lightsnow": "images/lightsnow.png",
        "mcloudy": "images/cloudy.png",
        "oshower": "images/oshower.png",
        "pcloudy": "images/pcloudy.png",
        "rain": "images/rain.png",
        "rainsnow": "images/rainsnow.png",
        "snow": "images/snow.png",
        "ts": "images/tsrain.png",
        "tstorm": "images/tstorm.png"
    };
    return weatherImages[weather.toLowerCase()]  // Return the correct image according to weather
}

// Function to get human-readable weather description
function getHumanReadableWeather(weather) {
    var weatherDescriptions = {
        "humid": "Humid",
        "windy": "Windy",
        "clear": "Clear",
        "cloudy": "Cloudy",
        "fog": "Fog",
        "ishower": "Isolated Showers",
        "lightrain": "Light Rain",
        "lightsnow": "Light Snow",
        "mcloudy": "Mostly Cloudy",
        "oshower": "Occasional Showers",
        "pcloudy": "Partly Cloudy",
        "rain": "Rain",
        "rainsnow": "Rain and Snow",
        "snow": "Snow",
        "ts": "Thunderstorm Possible",
        "tstorm": "Thunderstorm"
    };
    return weatherDescriptions[weather.toLowerCase()] || "Unknown Weather"; // Return unknown description if weather condition not found
}

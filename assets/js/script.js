// Define constants
const apiKey = "5e5015c5096a7c578a8f2e04af5843a4";
const inputForm = document.getElementById("input-form")
const inputCity = document.getElementById("input-city")
const alertCity = document.getElementById("alert-city")
const submitBtn = document.getElementById("submitBtn")
const searchHistory = document.getElementById("search-history")
// Primary weather card constants
const currentCity = document.getElementById("current-city")
const currentMax = document.getElementById("current-max")
const currentDescription = document.getElementById("current-description")
const currentWindSpeed = document.getElementById("current-ws")
const currentHumidity = document.getElementById("current-h")
const currentUV = document.getElementById("current-uv")
const currentUVDescription = document.getElementById("uv-desc")
const currentIcon = document.getElementById("current-icon")

// When the user clicks submit, get inputCity and fill weather cards with details
submitBtn.addEventListener("click", function (event) {
    event.preventDefault();
    fillCards();
    addHistory();
  });

// When the user types a city name and presses enter, get inputCity and fill weather cards with details
inputForm.addEventListener('submit', function(event){
    event.preventDefault();
    fillCards();
    addHistory();
})

// When the user submits a search, add search to the search history list
function addHistory() {
    // Retreive the city name
    var city = inputCity.value
    // Create list items
    var newSearchLi = document.createElement("li")
    var newSearchText = document.createElement("a")
    // Add city name to list item
    newSearchText.innerHTML = city
    // Add to DOM    
    newSearchLi.appendChild(newSearchText)
    searchHistory.appendChild(newSearchLi)

    // Add event listener to newly created list items
    newSearchLi.addEventListener("click", function(event) {
        event.preventDefault();
        // Assign the list element text to the input city value to return correct results
        inputCity.value = newSearchText.textContent
        // Run fillCards function
        fillCards()
    })
    

}

function fillCards() {
    // Hide alert whenever the submit button is pressed
    alertCity.setAttribute("class", "alert alert-danger mt-2 collapse")

    // Retreive the city name
    const city = inputCity.value;

    // Call the OpenWeather API
    getWeather(city)
        .then(function(weatherData) {

            // Retreive data in UNIX format and convert to string using Moment
            var currentDateUnix = weatherData.current.dt
            var currentDateString = moment.unix(currentDateUnix).format("DD/MM/YYYY")
            
            // Fill current weather card with todays details and max's
            currentCity.textContent = inputCity.value + " " + currentDateString
            currentMax.textContent = (weatherData.daily[0].temp.max).toFixed(1) + " °C"
            currentDescription.textContent = weatherData.daily[0].weather[0].description
            currentWindSpeed.textContent = weatherData.daily[0].wind_speed + " m/s" 
            currentHumidity.textContent = weatherData.daily[0].humidity + " %"
            currentUV.textContent = weatherData.daily[0].uvi

            // Indicate UV index favourable colourings
            if (currentUV.textContent <= 2) {
                currentUV.setAttribute("class", "ms-1 low")
                currentUVDescription.setAttribute("class", "low")
                currentUVDescription.innerHTML=" (Low)"
            }   else if (currentUV.textContent > 2 && currentUV.textContent <= 5) {
                currentUV.setAttribute("class", "ms-1 mod")
                currentUVDescription.setAttribute("class", "mod")
                currentUVDescription.innerHTML=" (Moderate)"
            }   else if (currentUV.textContent > 5 && currentUV.textContent <= 7) {
                currentUV.setAttribute("class", "ms-1 high")
                currentUVDescription.setAttribute("class", "high")
                currentUVDescription.innerHTML=" (High)"
            }   else if (currentUV.textContent > 7 && currentUV.textContent < 11) {
                currentUV.setAttribute("class", "ms-1 vhigh")
                currentUVDescription.setAttribute("class", "vhigh")
                currentUVDescription.innerHTML=" (Very High!)"
            }   else if (currentUV.textContent >= 11) {
                currentUV.setAttribute("class", "ms-1 extreme")
                currentUVDescription.setAttribute("class", "extreme")
                currentUVDescription.innerHTML=" (Extreme!!)"
            }


            // Match correct weather icon
            var currentWeatherCode = weatherData.daily[0].weather[0].icon
            currentIcon.src = ("http://openweathermap.org/img/wn/" + currentWeatherCode + "@4x.png")

            // Loop to create forecast cards
            for (let i = 1; i < 6; i++) {
                const forecastDate = document.getElementById("card-date-" + i)
                const forecastTemp = document.getElementById("card-temp-" + i)
                const forecastDesc = document.getElementById("card-description-" + i)
                const forecastWindSpeed = document.getElementById("card-ws-" + i)
                const forecastHumidity = document.getElementById("card-h-" + i)
                const forecastIcon = document.getElementById("card-icon-" + i)
                
                const forecastDateUnix = weatherData.daily[i].dt
                const forecastDateString = moment.unix(forecastDateUnix).format("DD/MM/YYYY")
                const forecastWeatherCode = weatherData.daily[i].weather[0].icon
                
                forecastDate.textContent = forecastDateString
                forecastDesc.textContent = weatherData.daily[i].weather[0].description
                forecastTemp.textContent = (weatherData.daily[i].temp.max).toFixed(1) + " °C"
                forecastWindSpeed.textContent = weatherData.daily[i].wind_speed + " m/s" 
                forecastHumidity.textContent = weatherData.daily[i].humidity + " %"
                forecastIcon.src = ("http://openweathermap.org/img/wn/" + forecastWeatherCode + "@4x.png")
            }
            
        })
        .catch(function() {
            // Show alert if city name is not recognized
            alertCity.setAttribute("class", "alert alert-danger mt-2 show")
        })
    
}


// Get the current weather API response and retreive as .json
function getCurrentWeatherAPI(city) {
    return fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    ).then(function(response) {
        return response.json();
    });
}
// Get the weather & forecast with the One Call API using longitude and latitude variables
function getOneCallAPI(longitude, latitude){
    return fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly&appid=${apiKey}&units=metric`
    ).then(function(response){
        return response.json();
    });
}
// Use the current weather API to determine Lon/Lat values for the city, then use those values for the OneCallAPI
function getWeather(city) {
    return getCurrentWeatherAPI(city)
    .then(function(currentWeatherResponse){
        const coord = currentWeatherResponse.coord;

        return getOneCallAPI(coord.lon, coord.lat)
        
    })
}



// TODO
// Autocomplete on search form -> Try not to allow any incorrect cities to be submitted
// Local storage for search history
// Hover attributes to list items -> cursor pointer

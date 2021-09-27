const apiKey = "5e5015c5096a7c578a8f2e04af5843a4";
// const dayQueryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=metric";
// const forecastQueryURL = "http://api.openweathermap.org/data/2.5/forecast/daily?q=" + city + "&cnt=5&appid=" + apiKey + "&units=metric";
const inputForm = document.getElementById("input-form")
const inputCity = document.getElementById("input-city")
const alertCity = document.getElementById("alert-city")
const submitBtn = document.getElementById("submitBtn")

const currentCity = document.getElementById("current-city")
const currentMax = document.getElementById("current-max")
const currentDescription = document.getElementById("current-description")
const currentWindSpeed = document.getElementById("current-ws")
const currentHumidity = document.getElementById("current-h")
const currentUV = document.getElementById("current-uv")


submitBtn.addEventListener("click", function (event) {
    event.preventDefault();
    inputForm.submit();
  });

// When the user types a city name and presses enter
inputForm.addEventListener('submit', function(event){
    event.preventDefault();
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
            currentMax.textContent = weatherData.daily[0].temp.max + " °C"
            currentDescription.textContent = weatherData.daily[0].weather[0].description
            currentWindSpeed.textContent = weatherData.daily[0].wind_speed + " m/s" 
            currentHumidity.textContent = weatherData.daily[0].humidity + " %"
            currentUV.textContent = weatherData.daily[0].uvi

            console.log(weatherData)
        })
        .catch(function(){
            // Show alert if city name is not recognized
            alertCity.setAttribute("class", "alert alert-danger mt-2 show")

        })
})

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


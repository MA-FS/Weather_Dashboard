var APIKey = "5e5015c5096a7c578a8f2e04af5843a4";
var city;
var dayQueryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey + "&units=metric";
var forecastQueryURL = "http://api.openweathermap.org/data/2.5/forecast/daily?q=" + city + "&cnt=5&appid=" + APIKey + "&units=metric";
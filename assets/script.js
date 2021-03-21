// my api key for openweather api
var apiKey = "9c776d4121d225d158430a58d8ce793e";

var cityFormEl = $("#cityForm");
var cityInputEl = $("#searchCity");
var searchBtn = $("#searchCityBtn");
var searchHistoryEl = $("#cityHistory");
var date = $("#date");
var currentForcast = $("#currentForcast");
var currentTemp = $("#temperature");
var currentHumidity = $("#humidity");
var currentWindSpeed = $("#windSpeed");
var currentUVIndex = $("#uvIndex");

var history = JSON.parse(localStorage.getItem("cities")) || [];
// console.log(history)

// fetch api to get current weather
var currentWeather = function(city) {
    var currentWeatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apikey + "&units=imperial";
    
    fetch(currentWeatherUrl).then(function(response) {
        if (response.ok) {
            console.log(response);
            return response.JSON().then(function(data) {
                console.log(data);
                displayWeather(data, city);
            });
        }
    });
}

// fetch api for 5 day forcast
var fiveDayForcast = function (city) {
    var currentWeatherUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey + "&units=imperial";

    fetch(currentWeatherUrl).then(function(city) {
        if (response.ok) {
            console.log(response);
            return response.JSON().then(function(data) {
                console.log(data);

                var fiveDayForcast = data.list;
                var filter = fiveDayForcast.filter(function(day) {
                    if day.dt_txt.indexOf("12:00:00") !== -1) {
                        return day;
                    }
                });
                console.log(filter);
                displayFiveDay(filter);
            });
        }
    });
}

// function to display current weather
function displayWeather(data, searchedCity) {
    var todayDate = moment().format("L");
}
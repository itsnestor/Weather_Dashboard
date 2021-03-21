// my api key for openweather api
var apiKey = "9c776d4121d225d158430a58d8ce793e";

var cityFormEl = $("#cityForm");
var cityInputEl = $("#searchCity");
var searchBtn = $("#searchCityBtn");
var searchHistoryEl = $("#cityHistory");
var date = $("#date");
var currentForcast = $("#currentForcast");
var weatherIcon = $("#weatherIcon")
var currentTemp = $("#temperature");
var currentHumidity = $("#humidity");
var currentWindSpeed = $("#windSpeed");
var currentUVIndex = $("#uvIndex");

var history = JSON.parse(localStorage.getItem("cities")) || [];
console.log(history)

var formSubmit = function(event) {
    event.preventDefault();

    var city = cityInputEl.val();
    if (city) {
        currentWeather(city);
        fiveDayForcast(city);
        cityInputEl.text("");
        cityInputEl.val("");

        var cities = JSON.parse(localStorage.getItem("cities")) || [];
        history.push(city);
        localStorage.setItem("cities", JSON.stringify(history));
        previousCitiesSearched();
    }
}

// fetch api to get current weather
var currentWeather = function(city) {
    var url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=9c776d4121d225d158430a58d8ce793e&units=imperial`;
    
    fetch(url).then(function (response) {
        if (response.ok) {
            console.log(response);
            return response.json().then(function(data) {
                console.log(data);
                displayWeather(data, city);
            });
        }
    });
}

// fetch api for 5 day forcast
var fiveDayForcast = function (city) {
    var url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=9c776d4121d225d158430a58d8ce793e&units=imperial`;

    fetch(url).then(function (response) {
        if (response.ok) {
            console.log(response);
            return response.json().then(function(data) {
                console.log(data);

                var fiveDayForcast = data.list;
                var filter = fiveDayForcast.filter(function (day) {
                    if (day.dt_txt.indexOf("12:00:00") !== -1) {
                        return day;
                    }
                });
                console.log(filter);
                displayFiveDayForecast(filter);
            });
        } 
    });
}

// fetch api for UV Index
function displayUVIndex(lat, lon) {
    var url = `http://api.openweathermap.org/data/2.5/uvi?lat=$(lat)&lon=$(lon)&appid=9c776d4121d225d158430a58d8ce793e`;
    
    fetch(url).then(function (response) {
        if (response.ok) {
            console.log(response);
            return reposnse.json().then(function(data) {
                console.log(data);
                var uvIndexDisplayed = data.current.uvi;
                currentUVIndex.text("UV Index: " + uvIndexDisplayed);

                if (uvIndexDisplayed <= 2) {
                    currentUVIndex.addClass("favorable");
                    currentUVIndex.removeClass("moderate");
                    currentUVIndex.removeClass("severe");
                } else if (uvIndexDisplayed >= 3) {
                    currentUVIndex.removeClass("favorable");
                    currentUVIndex.addClass("moderate");
                    currentUVIndex.removeClass("severe");
                } else if (uvIndexDisplayed >= 8) {
                    currentUVIndex.removeClass("favorable");
                    currentUVIndex.removeClass("moderate");
                    currentUVIndex.addClass("severe");
                }
            });
        }
    });
}

// function to display current weather
function displayWeather(data, searchedCity) {
    var todayDate = moment().format("L");
    var currentWeatherIcon = data.weather[0].icon;
    weatherIcon.attr("src", "http://openweathermap.org/img/w/" + currentWeatherIcon + ".png");

    var cityTemp = Math.round(data.main.temp);
    var windSpeed = Math.round(data.wind.speed);
    currentForcast.text(searchedCity);
    date.text(" (" + todayDate + ")");
    currentTemp.text("Temperature: " + cityTemp);
    currentHumidity.text("Humidity: " + data.main.humidity + " %");
    currentWindSpeed.text("Wind Speed: " + windSpeed + " MPH");
    
    var lat = data.coord.lat;
    var lon = data.coord.lon;
    displayUVIndex(lat, lon);
}

// function to display 5 day weather
function displayFiveDayForecast(forecast) {
    $("#fiveDay").html("");
    forecast.forEach(function(day){
        var eachDay = $("<div>");
        eachDay.attr("class", "column col-2 h-auto text-left");
        
        var date = $("<h6>");
        date.text(new Date(day.dt_txt).toLocaleDateString());
        eachDay.append(date);
        
        var fiveDayIcon = $("<img>");
        var fiveDayIconCode = day.weather[0].icon;
        fiveDayIcon.attr("src", "http://openweathermap.org/img/w/" + fiveDayIconCode + ".png");
        eachDay.append(fiveDayIcon)

        var fiveDayTemp = $("<h6>");
        var fiveDayTempRounded = Math.round(day.main.temp);
        fiveDayTemp.text("Temperature: " + fiveDayTempRounded);
        eachDay.append(fiveDayTemp);

        var humidity = $("<h6>");
        humidity.text("Humidity: " + day.main.humidity + " %");
        eachDay.append(humidity);
    });
}

// function to create search history
function previousCitiesSearched() {
    searchHistoryEl.empty();
    if (history.length === 6) {
        history.shift();
    }
    for (let i=0; i<history.length; i++) {
        var oldCitySearch = document.createElement("input");
        oldCitySearch.setAttribute("type", "text");
        oldCitySearch.setAttribute("readonly", true);
        oldCitySearch.setAttribute("class", "form-control d-block bg-white");
        oldCitySearch.setAttribute("value", history[i]);
        oldCitySearch.addEventListener("click", function() {
            currentWeather(oldCitySearch.value);
            fiveDayForcast(oldCitySearch.value);
        });
        searchHistoryEl.append(oldCitySearch);
    }
}

previousCitiesSearched();
if (history.length > 0) {
    currentWeather(history[history.length - 1]);
    fiveDayForcast(history[history.length - 1]);
}

cityFormEl.on("submit", formSubmit);
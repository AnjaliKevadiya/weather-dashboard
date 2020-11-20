
var apiKey = "23a78a66b8e6dc546e2534b9c6379878";

//get today's date
var todayDate = moment().format('l');

//Grab the citiesObject from the local storage
var allCities = JSON.parse(localStorage.getItem("citiesObject")) || [];


$(document).ready(function() {

    //create the city list if there is already in local storage
    createCityList();

    //search button onClick
    $("#search-button").on("click", function() {

        var cityName = $("#search-value").val().trim();

        if(cityName === "") {
            alert("Please enter city first!");
        } else {

            //call the search weather function to get data from api
            searchWeather(cityName);

            //clear the input value after every search
            $("#search-value").val("");    
        }
    });

});

function createCityList() {

    $("#city-name").empty();

    if (allCities.length > 0) {
        $("#city-name").show();
    }

    //Create City List
    var card = $("<div>").addClass("card");
    var cityUlEl = $("<ul>").addClass("list-group list-group-flush");

    allCities.forEach(city => {    
        var cityLiEl = $("<li>").addClass("list-group-item").text(city);
        cityLiEl.on("click", function() {
            // forcastWeather(city);
            searchWeather(city);
        });
        cityUlEl.append(cityLiEl);    
    });
    
    card.append(cityUlEl);
    $("#city-name").append(card);   
}

//Function to store city in local storage
function storeCityToStorage(cityName) {

    if(allCities.filter(c => c === cityName).length === 0) {
        allCities.push(cityName);
        localStorage.setItem("citiesObject", JSON.stringify(allCities));    
    }
}

//Function for search city weather
function searchWeather(cityName) {

    var weatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey + "&units=imperial";

    if(cityName !== ""){
        $.ajax({
            url: weatherUrl,
            type: "GET",
            dataType: "json"
        }).then(function(response) {
            console.log(weatherUrl);

            storeCityToStorage(response.name);
            createCityList();

            if(response.coord !== null) {
                //call the getUVIndex function to get UVIndex
                getUVIndex(response);
                
                //call the forcast weather function to get 5 days forcast
                forcastWeather(cityName);
            } 
        });    
    } 
}

//Function for getting uiIndex
function getUVIndex(weatherResponse) {

    if(weatherResponse.coord !== null) {

        var uvIndexUrl = "https://api.openweathermap.org/data/2.5/uvi?lat=" + weatherResponse.coord.lat + "&lon=" + weatherResponse.coord.lon + "&appid=" + apiKey;

        $.ajax({
            url: uvIndexUrl,
            method: "GET"
        }).then(function (response) {
    
            console.log(uvIndexUrl);

            if(response.value !== null) {

                //clear the previous city weather detail
                $("#today").empty();

                var titleName = weatherResponse.name + " (" + todayDate + ") ";
                console.log(titleName);

                var card = $("<div>").addClass("card");
                var cardBody = $("<div>").addClass("card-body");

                var title = $("<h3>").addClass("card-title").text(titleName);
                var icon = "<img src='https://openweathermap.org/img/w/" + weatherResponse.weather[0].icon + ".png'>";
                var temp = $("<p>").addClass("card-text").text("Temperatre: " + weatherResponse.main.temp + " °F");
                var humidity = $("<p>").addClass("card-text").text("Humidity:  " + weatherResponse.main.humidity + " %");
                var wind = $("<p>").addClass("card-text").text("Wind Speed: " + weatherResponse.wind.speed + " MPH");
                var uvIndex = $("<p>").addClass("card-text").text("UV Index: " + response.value);

                cardBody.append(title, icon, temp, humidity, wind, uvIndex);
                card.append(cardBody);
                $("#today").append(card);    
            }
        });
    }
}

//Function for 5 day forcast weather detail
function forcastWeather(cityName) {
    var forcastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + apiKey;

    $.ajax({
        url: forcastUrl,
        method: "GET"
    }).then(function(response) {

        console.log(forcastUrl);

        $("#forecast").empty();

        var h3 = $("<h3>").text("5-Day Forecast:").css("margin-top", "20px");
        $("#forecast").append(h3);     

        for(var i = 0; i < response.list.length; i+=8) {

            console.log(response.list[i]);
            var list = response.list[i];

            var formattedDate = new Date(list.dt_txt).toLocaleDateString('en-US');
            var tempInF = (list.main.temp - 273.15) * 1.80 + 32;

            var span = $("<span>").addClass("span-inline");
            var div = $("<div>").addClass("card text-white bg-primary mb-3 text-center").css("max-width", "15rem");
            var divBody = $("<div>").addClass("card-body");

            var date = $("<h5>").addClass("card-title").text(formattedDate);
            var icon = "<img src='https://openweathermap.org/img/w/" + list.weather[0].icon + ".png'>";
            var temp = $("<p>").addClass("card-title").text("Temp: " + tempInF.toFixed(2) + " °F");
            var humidity = $("<p>").addClass("card-title").text("Humidity: " + list.main.humidity + "%");
        
            divBody.append(date, icon, temp, humidity);
            div.append(divBody);   
            span.append(div);
            $("#forecast").append(span);     
        }
    });
}


var apiKey = "23a78a66b8e6dc546e2534b9c6379878";

var todayDate = moment().format('l');
var todayTime = moment().format('H');

//Grab the citiesObject from the local storage
var allCities = JSON.parse(localStorage.getItem("citiesObject")) || [];

$(document).ready(function() {

    createCityList();

    //search button onClick
    $("#search-button").on("click", function() {

        var cityName = $("#search-value").val().trim();

        if(cityName === "") {
            alert("please enter city first!");
        } else {

            //call the search weather function to get data from api
            searchWeather(cityName);

            //call the forcast weather function to get 5 days forcast
            forcastWeather(cityName);

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
                searchWeather(city);
            });
            cityUlEl.append(cityLiEl);    
        });
        
        card.append(cityUlEl);
        $("#city-name").append(card);   
}

function storeCityToStorage(cityName) {

    if(allCities.filter(c => c === cityName).length === 0) {
        allCities.push(cityName);
        localStorage.setItem("citiesObject", JSON.stringify(allCities));    
    }
}

function searchWeather(cityName) {

    var weatherUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey + "&units=imperial";

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
                getUVIndex(response);
            } 
        });    
    } 
}

function getUVIndex(weatherResponse) {

    if(weatherResponse.coord !== null) {

        var uvIndexUrl = "http://api.openweathermap.org/data/2.5/uvi?lat=" + weatherResponse.coord.lat + "&lon=" + weatherResponse.coord.lon + "&appid=" + apiKey;

        $.ajax({
            url: uvIndexUrl,
            method: "GET"
        }).then(function (response) {
    
            if(response.value !== null) {

                //clear the previous city weather detail
                $("#today").empty();

                //Create Card
                var titleName = weatherResponse.name + " (" + todayDate + ") ";
                console.log(titleName);

                var card = $("<div>").addClass("card");
                var cardBody = $("<div>").addClass("card-body");

                var title = $("<h3>").addClass("card-title").text(titleName);
                var temp = $("<p>").addClass("card-text").text("Temperatre: " + weatherResponse.main.temp + " °F");
                var humidity = $("<p>").addClass("card-text").text("Humidity:  " + weatherResponse.main.humidity + " %");
                var wind = $("<p>").addClass("card-text").text("Wind Speed: " + weatherResponse.wind.speed + " MPH");
                var uvIndex = $("<p>").addClass("card-text").text("UV Index: " + response.value);

                cardBody.append(title, temp, humidity, wind, uvIndex);
                card.append(cardBody);
                $("#today").append(card);    
            }
        });
    
    }
}

function forcastWeather(cityName) {
    var forcastUrl = "http://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + apiKey;

    $.ajax({
        url: forcastUrl,
        method: "GET"
    }).then(function(response) {
        console.log(forcastUrl);
        // console.log("forcast: " + JSON.stringify(response));

        var div = $("<div>").addClass("card text-white bg-primary mb-3").css("max-width", "13rem");
        var divBody = $("<div>").addClass("card-body");
        var date = $("<h5>").addClass("card-title").text("Date");
        var temp = $("<p>").addClass("card-title").text("Temp: ");
        var humidity = $("<p>").addClass("card-title").text("Humidity: ");

        divBody.append(date, temp, humidity);
        div.append(divBody);
        $("#forcast").append(div);
    });
}

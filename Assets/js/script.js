
var apiKey = "23a78a66b8e6dc546e2534b9c6379878";

var card = $("<div>").addClass("card");
var cardBody = $("<div>").addClass("card-body");
card.append(cardBody);
$("#today").append(card);    

$(document).ready(function() {

    //search button onClick
    $("#search-button").on("click", function() {

        var cityName = $("#search-value").val().trim();

        if(cityName === "") {
            alert("please enter city first!");
        } else {
            //clear the previous city weather detail
            $("#today").text("");

            //call the search weather function to get data from api
            searchWeather(cityName);

            //clear the input value after every search
            $("#search-value").val("");    
        }
    });

    // forcastWeather(cityName);
});

function searchWeather(cityName) {
    var weatherUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey + "&units=imperial";

    if(cityName !== ""){
        $.ajax({
            url: weatherUrl,
            type: "GET",
            dataType: "json"
        }).then(function(response) {
            console.log(weatherUrl);
            // console.log("weather: " + JSON.stringify(response));

            //Create Card
            var title = $("<h3>").addClass("card-title").text(response.name);
            var temp = $("<p>").addClass("card-text").text("Temperatre: " + response.main.temp + " °F");
            var humidity = $("<p>").addClass("card-text").text("Humidity:  " + response.main.humidity + " %");
            var wind = $("<p>").addClass("card-text").text("Wind Speed: " + response.wind.speed + " MPH");

            cardBody.append(title, temp, humidity, wind);

            if(response.coord !== null) {
                getUVIndex(response.coord.lat, response.coord.lon);
            } else {
                card.append(cardBody);
                $("#today").append(card);    
            }

            // //Create City List
            // var card = $("<div>").addClass("card");
            // var cityUlEl = $("<ul>").addClass("list-group list-group-flush");
            // var cityLiEl = $("<li>").addClass("list-group-item").text(response.name);
            
            // cityUlEl.append(cityLiEl);
            // card.append(cityUlEl);
            // $("#city-name").append(card);
        });    
    } else {
        //show alert please enter cityname to know weather
    }
}

function getUVIndex(latitude, longitude) {

    var uvIndexUrl = "http://api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longitude + "&appid=" + apiKey;

    $.ajax({
        url: uvIndexUrl,
        method: "GET"
    }).then(function (response) {

        if(response.value !== null) {
            var uvIndex = $("<p>").addClass("card-text").text("UV Index: " + response.value);

            cardBody.append(uvIndex);
            card.append(cardBody);
            $("#today").append(card);    
        }
    });
}

function forcastWeather(cityName) {
    var forcastUrl = "http://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + apiKey;

    $.ajax({
        url: forcastUrl,
        method: "GET"
    }).then(function(response) {
        console.log(forcastUrl);
        // console.log("forcast: " + JSON.stringify(response));
    });
}

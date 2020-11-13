
var apiKey = "23a78a66b8e6dc546e2534b9c6379878";

$(document).ready(function() {

    $("#search-button").on("click", function() {
        var cityName = $("#search-value").val().trim();

        searchWeather(cityName);

        $("#search-value").val("");
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
            var card = $("<div>").addClass("card");
            var wind = $("<p>").addClass("card-text").text("Wind Speed:" + response.wind.speed);
            var humidity = $("<p>").addClass("card-text").text("Humidity: " + response.main.humidity);

            var cardBody = $("<div>").addClass("card-body");
            cardBody.append(title, wind, humidity);

            card.append(cardBody);

            $("#today").append(card);


            //Create City List
            var card = $("<div>").addClass("card");
            var cityUlEl = $("<ul>").addClass("list-group list-group-flush");
            var cityLiEl = $("<li>").addClass("list-group-item").text(response.name);
            
            cityUlEl.append(cityLiEl);
            card.append(cityUlEl);
            $("#city-name").append(card);
        });    
    } else {
        //show alert please enter cityname to know weather
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
    });
}

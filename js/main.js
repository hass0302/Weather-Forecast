document.addEventListener("DOMContentLoaded", function () {
    serverData.getJSON();
});
var unitF = false;
var tomorrow = false;

function TempUnitSelector() {
    unitF = !unitF;
    document.querySelector(".weather-forecast").innerHTML = "";
    displayHourlyData(serverData.getJSON());
}

function DaySelector() {
    tomorrow = !tomorrow;
    document.querySelector(".weather-forecast").innerHTML = "";
    displayHourlyData(serverData.getJSON());
}
let serverData = {
    url: "http://hass0302.edumedia.ca/mad9014/weather/forecast.php"
    , httpRequest: "GET"
    , getJSON: function () {
        let headers = new Headers();
        headers.append("Content-type", "text/plain");
        headers.append("Accept", "application/json; charset=utf-8");
        let options = {
            method: serverData.httpRequest
            , mode: "cors"
            , headers: Headers
        };
        let request = new Request(serverData.url, options);
        console.log(request);
        fetch(request).then(function (response) {
            //            console.log(response);
            return response.json();
        }).then(function (data) {
            console.log(data); // now we have JS data, let's display it
            displayHourlyData(data.hourly.data);
        }).catch(function (err) {
            alert("Error: " + err.message);
        });
    }
};

function ConvertTemperature(data) {
    let fahrent = data * 9 / 5 + 32;
    return Math.floor(fahrent);
}

function ConvertTime(data) {
    //this function converts time into AM / PM
    // if it is at 12 or higher. it means that it is in the PM
    if (data >= 12) {
        // divide the time by 12. whatever remains will be used
        // for displaying in PM
        data = data % 12;
        // if time is 0
        if (data == 0) {
            return "12 PM"
        }
        else {
            return (data + " PM");
        }
    }
    else {
        // if time is 0. it means it is at midnight. hence return 12AM
        if (data == 0) {
            return "12 AM";
        }
        else {
            return (data + " AM");
        }
    }
}

function ConvertIcon(data) {
    if (data.indexOf("partly-cloudy") != -1) {
        data = "wi-cloudy";
    }
    else if (data.indexOf('-day') != -1) {
        data = data.replace("-day", '');
        // there is no day clear icon. so I hard coded as day sunny as per document
        // https://erikflowers.github.io/weather-icons/api-list.html
        if (data.indexOf('clear') != -1) {
            data = "wi-day-sunny";
            return data;
        }
        data = "wi-day-" + data;
    }
    else if (data.indexOf("-night") != -1) {
        data = data.replace("-night", '');
        data = "wi-night-" + data;
    }
    else {
        data = "wi-" + data;
    }
    return data;
}

function ConvertTextForecast(data) {
    if (data.indexOf('-day') != -1) {
        data = data.replace("-day", '');
    }
    else if (data.indexOf("-night") != -1) {
        data = data.replace("-night", '');
    }
    else {
        data = data.replace('-', ' ');
        return data;
    }
    data = data.replace('-', ' ')
    return data;
}

function displayHourlyData(data) {
    if (data.length == 0) {
        return;
    }
    if (tomorrow) {
        var numberOfHoursToDisplay = 48;
    }
    else {
        var numberOfHoursToDisplay = 24;
    }
    let numberOfHours = null;
    if (data.length >= numberOfHoursToDisplay) {
        numberOfHours = numberOfHoursToDisplay;
    }
    else {
        numberOfHours = data.length;
    }
    let time = new Date();
    let weatherForecastDiv = document.querySelector(".weather-forecast");
    for (let i = 0; i < numberOfHours; i++) {
        time.setTime(data[i].time * 1000);
        console.log(time);
        data[i].temperature = Math.floor(data[i].temperature);
        let div = document.createElement("div");
        div.id = time.getHours();
        div.classList.add("wi");
        div.classList.add(ConvertIcon(data[i].icon));
        div.innerHTML = "<ul>";
        div.innerHTML += "<li><strong>" + ConvertTime(time.getHours()) + "</strong></li>";
        if (unitF == true) {
            div.innerHTML += "<li>" + ConvertTemperature(data[i].temperature) + "&#8457;</li>";
        }
        else {
            div.innerHTML += "<li>" + data[i].temperature + "&#8451;</li>";
        }
        ConvertIcon(data[i].icon);
        div.innerHTML += "<li>" + ConvertTextForecast(data[i].icon) + "</li>";
        div.innerHTML += "</ul>"
        weatherForecastDiv.appendChild(div);
    }
}
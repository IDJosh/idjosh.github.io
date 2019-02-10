//  Cookie Functions
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
     d.setTime(d.getTime() + (exdays*24*60*60*1000));
     var expires = "expires="+ d.toUTCString();
     document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while(c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return " ";
}

// Clock
const eorzeaMultiplier = 20.571428571428573;

var enableAMPM = getCookie("enableAMPM") === '1' ? true : false;
var eorzeaClockElement = document.getElementById("eorzeaClock");

function updateClock() {
    var localEpoch = (new Date).getTime();
    var epoch = localEpoch * eorzeaMultiplier;

    var eorDate = new Date(epoch);
    var eorzeaHour = ("0" + eorDate.getUTCHours()).slice(-2);
    var eorzeaMinute = ("0" + eorDate.getUTCMinutes()).slice(-2);

    if (enableAMPM) {
        var ampmString = eorzeaHour >= 12 ? " PM" : " AM";

        eorzeaHour = eorzeaHour % 12;
        eorzeaHour = eorzeaHour ? eorzeaHour : 12;

        document.title =  "XIV Tools [ET] " + eorzeaHour + ":" + eorzeaMinute +  ampmString;
    } else {
        document.title =  "XIV Tools [ET] " + eorzeaHour + ":" + eorzeaMinute;
    }

};
setInterval(updateClock, 2916.66667);

function changeTimeFormat(e) {
    if (e.value === "0" || e.value === "1") {

        setCookie("enableAMPM", e.value, 3650);
        enableAMPM = getCookie("enableAMPM") === '1' ? true : false;
        updateClock();
        timeSwitchBtns();
    }
}

function timeSwitchBtns() {
    var elements = document.getElementsByClassName("timeBtn");

    for (var i = 0; i < elements.length; i++) {
        if (elements[i].value == enableAMPM) {
            elements[i].disabled = true;
        } else {
            elements[i].disabled = false;
        }
    }
}

var displayWeather = function() {
   $("#weatherDiv").text(WeatherFinder.getWeather(new Date(), $("#zoneSelect").val()));
}

function findWeather() {
   $("#weatherDiv").text('');
   $("#weatherTableHeaderRow ~ tr").remove()

   var weatherStartTime = WeatherFinder.getWeatherTimeFloor(new Date()).getTime();
   var weatherStartHour = WeatherFinder.getEorzeaHour(weatherStartTime);
   var zone = $("#zoneSelect").val();
   var targetWeather = $("#weatherSelect").val();
   var targetPrevWeather = $("#previousWeatherSelect").val();
   var tries = 0;
   var matches = 0;
   var weather = WeatherFinder.getWeather(weatherStartTime, zone);
   var prevWeather = WeatherFinder.getWeather(weatherStartTime-1, zone);

   while (tries < 1000 && matches < 5) {
      var weatherMatch = targetWeather == null;
      var prevWeatherMatch = targetPrevWeather == null;
      var timeMatch = false;
      for (var i in targetWeather) {
         if (targetWeather[i] == "" || targetWeather[i] == weather) {
            weatherMatch = true;
            break;
         }
      }
      for (var i in targetPrevWeather) {
         if (targetPrevWeather[i] == "" || targetPrevWeather[i] == prevWeather) {
            prevWeatherMatch = true;
         }
      }
      if ($("#timeBox" + weatherStartHour).is(":checked")) {
         timeMatch = true;
      }
      if (weatherMatch && prevWeatherMatch && timeMatch) {
         var weatherDate = new Date(weatherStartTime);
         $("#weatherTable").append('<tr><td>' + prevWeather + '</td><td>' + weather + '</td><td>' + weatherStartHour + ':00</td><td>' + weatherDate + '</td></tr>');
         matches++;
      }

      weatherStartTime += 8 * 175 * 1000; // Increment by 8 Eorzean hours
      weatherStartHour = WeatherFinder.getEorzeaHour(weatherStartTime);
      prevWeather = weather;
      weather = WeatherFinder.getWeather(weatherStartTime, zone);
      tries++;
   }

   if (matches == 0) {
      $("#weatherDiv").append("Couldn't find the desired conditions over the next 1000 weather cycles (~16 Earth days).  Make sure you have selected at least one time period.<br/>");
   }
}

function populateZones() {
    var zones = WeatherFinder.weatherLists;
    var zoneSelect = $('#zoneSelect');
    for (var key in zones) {
        zoneSelect.append('<option value="' + key + '">' + key + '</option>');
    }
}

function populateWeather() {

    var climate = WeatherFinder.weatherLists[$("#zoneSelect").val()];
    var climateTable = $("#climateTable");
    climateTable.empty();

    if (climate != null) {
        for (i = 0; i < climate.length; i++) {
            climateTable.append('<tr><td><img src="img/icons/weather/' + climate[i].split(' ').join('_') + '_icon.png"></td><td>' + climate[i] + '</td></tr>');
        }
    }

    // var weathers = WeatherFinder.weatherLists[$("#zoneSelect").val()];
    // var selects = $("#weatherSelect").add("#previousWeatherSelect");
    // selects.empty();
    // selects.append('<option value="" selected="selected">Any</option>');
    // for (var w in weathers) {
    //     selects.append('<option value="' + weathers[w] + '">' + weathers[w] + '</option>');
    // }
}

window.onload = function() {
    timeSwitchBtns();
    updateClock();
    populateZones();
};

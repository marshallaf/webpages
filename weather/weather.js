// this is the URL that I'm trying to get
var weatherURL = "kumquat";
var weatherDesc = "";
var temp = -1;
var iconId = "";
var fahr = true;

var iconURLs = {
	"Clouds": "http://image005.flaticon.com/137/svg/116/116305.svg",
	"Clear": "http://image005.flaticon.com/137/svg/116/116254.svg",
	"Snow": "http://image005.flaticon.com/137/svg/116/116250.svg",
	"Rain": "http://image005.flaticon.com/137/svg/116/116251.svg",
	"Drizzle": "http://image005.flaticon.com/137/svg/116/116251.svg",
	"Thunderstorm": "http://image005.flaticon.com/137/svg/116/116244.svg"
}

function setWeatherURL() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			weatherURL = "http://api.openweathermap.org/data/2.5/weather?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude + "&appid=0f741008f459d5bb53f1cd76d9d16ae2";
			getNewWeather();
		});
	}
}

function getNewWeather() {
	$.ajax( {
	    url: weatherURL,
	    datatype: 'jsonp',
	    success: function(data) {
	    	weatherDesc = data.weather[0].description;
	    	temp = parseFloat(data.main.temp);
	    	iconId = data.weather[0].main;
	    	dispWeather();
	    	setWeatherCookies();
	    }
	});
}

function setWeatherCookies() {
	var d = new Date();
	d.setTime(d.getTime() + 10*60*1000);
	var expires = "expires=" + d.toUTCString();
	document.cookie = "weatherDesc=" + weatherDesc + "; " + expires;
	document.cookie = "temp=" + temp + "; " + expires;
	document.cookie = "iconId=" + iconId + "; " + expires;
}

function getWeather() {
	var cookieArray = document.cookie.split(';');
	var isOldWeatherValid = false;
	for (var i = 0; i < cookieArray.length; i++) {
		var c = cookieArray[i];
		c = c.trim();
		if (c.indexOf("weatherDesc=") == 0) {
			weatherDesc = c.substring(12, c.length);
			isOldWeatherValid = true;
		}
		if (c.indexOf("temp=") == 0) {
			temp = c.substring(5, c.length);
		}
		if (c.indexOf("iconId=") == 0) {
			iconId = c.substring(7, c.length);
		}
	}
	if (isOldWeatherValid) {
		dispWeather();
	} else {
		setWeatherURL();
	}
}

function dispWeather() {
	$("#tempNo").html(Math.round(temp*(9.0/5.0)-459.67));
	$("#weather-desc").html(weatherDesc);
	$(".icon").prop("src", iconURLs[iconId]);
	convertSVG();
}

function convertSVG() {
	/*
     * Replace all SVG images with inline SVG
     */
    $('img.svg').each(function(){
        var $img = $(this);
        var imgID = $img.attr('id');
        var imgClass = $img.attr('class');
        var imgURL = $img.attr('src');

        $.get(imgURL, function(data) {
            // Get the SVG tag, ignore the rest
            var $svg = $(data).find('svg');

            // Add replaced image's ID to the new SVG
            if(typeof imgID !== 'undefined') {
                $svg = $svg.attr('id', imgID);
            }
            // Add replaced image's classes to the new SVG
            if(typeof imgClass !== 'undefined') {
                $svg = $svg.attr('class', imgClass+' replaced-svg');
            }

            // Remove any invalid XML tags as per http://validator.w3.org
            $svg = $svg.removeAttr('xmlns:a');

            // Replace image with new SVG
            $img.replaceWith($svg);

        }, 'xml');

    });
}

$(document).ready(function() {

	getWeather();	

	$("#changeTemp").on('click', function(e) {
		if (fahr) {
			$("#tempNo").html(Math.round(temp-273.15));
			$("#changeTemp").html("&deg;C");
			fahr = false;
		} else {
			$("#tempNo").html(Math.round(temp*(9.0/5.0)-459.67));
			$("#changeTemp").html("&deg;F");
			fahr = true;
		}
	});
});
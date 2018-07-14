// Declare Variables
var userDestinationString;
var userDestination = ["Kyoto", "Japan"];
var userLocation = ["Toronto", "Canada"];
var destinationLatLng;

var restCountriesURL;
var geonamesURL;
var wikipediaURL;

var googleAPIKey = "AIzaSyCN3EyjOpztvL3D3bhE9zYi7KoSpczjM1s";
var googlePlaceID;
var googlePhotoID;
var googlePhotosArray = [];

//https://maps.googleapis.com/maps/api/place/textsearch/json?query=kyoto+japan&language=en&key=AIzaSyCN3EyjOpztvL3D3bhE9zYi7KoSpczjM1s
var mapsQueryURL;

//https://maps.googleapis.com/maps/api/place/details/json?placeid=ChIJ8cM8zdaoAWARPR27azYdlsA&key=AIzaSyCN3EyjOpztvL3D3bhE9zYi7KoSpczjM1s
var placesQueryURL;

//https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=CnRtAAAATLZNl354RwP_9UKbQ_5Psy40texXePv4oAlgP4qNEkdIrkyse7rPXYGd9D_Uj1rVsQdWT4oRz4QrYAJNpFX7rzqqMlZw2h2E2y5IKMUZ7ouD_SlcHxYq1yL4KbKUv3qtWgTK0A6QbGh87GB3sscrHRIQiG2RrmU_jF4tENr9wGS_YxoUSSDrYjWmrNfeEHSGSc3FyhNLlBU&key=AIzaSyCN3EyjOpztvL3D3bhE9zYi7KoSpczjM1s
var photosQueryURL;


var newsAPIKey = "6bf648adc8a74ad8830c059dea6040e1";

//https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=6bf648adc8a74ad8830c059dea6040e1
var newsQueryURL;
var newsDate;

var NOAAAPIKey = "DNAzgdbJbGUOWwjRggETatgbpadNAEVY";
var NOAAQueryURL;

var WorldBankQueryURL;
var iso3name;
var month;
//http://climatedataapi.worldbank.org/climateweb/rest/v1/country/mavg/tas/1980/1999/CAN

var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];


// Declare Functions
function googlePlacesQuery() {
/*     mapsQueryURL = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=" + userDestination[0] + "+" + userDestination[1] + "&language=en&key=" + googleAPIKey;
    console.log(mapsQueryURL); */

    service = new google.maps.places.PlacesService($("#service_helper").get(0));
    service.findPlaceFromQuery({
        query: userDestination[0] + " " + userDestination[1],
        fields: ["formatted_address", "geometry", "icon", "id", "name", "place_id"]
    }, function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            googlePlaceID = results[0].place_id;
            destinationLatLng = results[0].geometry.location;
            populatePhotoArray();
            initMap();
        } else {
            alert(status);
        }
    });



/*     $.ajax({
        url: mapsQueryURL,
        method: "GET"
    }).then(function(response) {
        googlePlaceID = response.results[0].place_id;
        destinationLatLng = response.results[0].geometry.location;
        console.log(destinationLatLng);
    }).then(populatePhotoArray).then(initMap); */
}

function populatePhotoArray() {
/*     placesQueryURL = "https://maps.googleapis.com/maps/api/place/details/json?placeid=" + googlePlaceID + "&key=" + googleAPIKey;
    console.log(placesQueryURL); */

    service = new google.maps.places.PlacesService($("#service_helper2").get(0));
    service.getDetails({
        placeId: googlePlaceID,
        fields: ["address_component", "adr_address", "alt_id", "formatted_address", "geometry", "icon", "id", "name", "permanently_closed", "photo", "place_id", "plus_code", "scope", "type", "url", "utc_offset", "vicinity"]
    }, function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.photos.length; i++) {
                $("<div>").addClass("carousel-item").append("<img class=\"d-block carousel_image\" src=" + results.photos[i].getUrl({maxHeight: 1500}) + ">").appendTo(".carousel-inner");
            }

            $(".carousel-item:first").addClass("active");

        } else {
            alert(status);
        }
    });

/*     $.ajax({
        url: placesQueryURL,
        method: "GET"
    }).then(function(response) {
        for (var i = 0; i < response.result.photos.length; i++) {
            googlePhotosArray.push(response.result.photos[i].photo_reference);
        }
    }).then(populatePhotoCarousel); */
    
}

/* function populatePhotoCarousel() {

    for (var i = 0; i < googlePhotosArray.length; i++) {
        photosQueryURL = "https://maps.googleapis.com/maps/api/place/photo?maxheight=300&photoreference=" + googlePhotosArray[i] + "&key=" + googleAPIKey;
        $("<div>").addClass("carousel-item").append("<img class=\"d-block carousel_image\" src=" + photosQueryURL + ">").appendTo(".carousel-inner");
        //$("#city_photo_carousel").append("<img class=\"carousel_image\" src=" + photosQueryURL + ">");
    }

    $(".carousel-item:first").addClass("active");

} */

/* function geonamesQuery() {
    geonamesURL = "http://api.geonames.org/wikipediaSearchJSON?q=" + userDestination[0] + "&maxRows=10&username=msvendsentan";
    
    $.ajax({
        url: geonamesURL,
        method: "GET"
    }).then(function(response) {
        $("#city_description").html("<p>" + response.geonames[0].summary + "</p>")
    });
} */

function wikipediaQuery() {
    wikipediaURL = "https://en.wikipedia.org/api/rest_v1/page/summary/" + userDestination[0];

    $.ajax({
        url: wikipediaURL,
        method: "GET"
    }).then(function(response) {
        $("#city_description").html("<p>" + response.extract + "</p>");
    });
}

function newsQuery() {
    newsQueryURL = "https://newsapi.org/v2/everything?q=(" + userDestination[0] + "%20and%20" + userDestination[1] + ")&sortBy=popularity&pageSize=10&apiKey=" + newsAPIKey;
    console.log(newsQueryURL);

    $.ajax({
        url: newsQueryURL,
        method: "GET"
    }).then(function(response) {
       
        for (var i = 0; i < 5; i++) {
           
            var storyContainer = $("<div>");
            storyContainer.addClass("story_container");

            var storyURL = $("<a>").attr("href", response.articles[i].url);
            storyURL.append(response.articles[i].title);

            var storyTitle = $("<div>");
            storyTitle.addClass("story_title").append(storyURL);
    
            var storyDescription = $("<div>");
            storyDescription.addClass("story_description").append("<p>" + response.articles[i].description + "</p>");
    
            storyContainer.append(storyTitle).append(storyDescription).appendTo("#stories_list");
        }
    });
}

function countryInfoQuery() {
    restCountriesURL = "https://restcountries.eu/rest/v2/name/" + userDestination[1];
    console.log(restCountriesURL);

    $.ajax({
        url: restCountriesURL,
        method: "GET"
    }).then(function(response) {
        iso3name = response[0].alpha3Code;

        $("#country_info_container")
            .append("<h2>A snapshot of " + response[0].name + "</h2>")
            .append("<img class=\"flag\" src=" + response[0].flag + ">")
            .append("<p><b>Primary Language:</b> " + response[0].languages[0].name + "</p>")
            .append("<p><b>Capital:</b> " + response[0].capital + "</p>")
            .append("<p><b>Primary Currency:</b> " + response[0].currencies[0].symbol + " " + response[0].currencies[0].name + "</p>")

    }).then(countryClimateQuery);

}

function countryClimateQuery() {
    WorldBankQueryURL = "http://climatedataapi.worldbank.org/climateweb/rest/v1/country/mavg/tas/1980/1999/" + iso3name;
    console.log(WorldBankQueryURL);

    month = new Date().getUTCMonth();

    $.ajax({
        url: WorldBankQueryURL,
        method: "GET"
    }).then(function(climateResponse) {

        var fullClimateObject = climateResponse.find( source => source.gcm = "cccma_cgcm3_1");
        var climate = fullClimateObject.monthVals[month];
        $("#country_info_container").append("<p><b>Climate in " + months[month] + ":</b> " + climate + " °C</p>")

    });


}

var map, service;

function initMap() {
    // The map, centered at Uluru
    map = new google.maps.Map(
        document.getElementById('map'), {zoom: 12, center: destinationLatLng});
    // The marker, positioned at Uluru
    var marker = new google.maps.Marker({position: destinationLatLng, map: map});
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
        location: destinationLatLng,         
        radius: 20000,
        keyword: "Points of Interest"
    }, function (results, status) {
        console.log(results);
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            results.forEach(function (p) {
                var m = new google.maps.Marker({
                   position: p.geometry.location,
                   icon: {
                        url: p.icon,
                        scaledSize: new google.maps.Size(24,24)
                   },
                   title: p.name,
                   map: map
                });                  
            });
        } else {
            alert(status);
        }
    });    
}



//Unnecessary because free news plan is max 1 month in the past.
/* function dateBacktrack() {
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();

    var monthDelay = 1;

    var newMonth = month - monthDelay;
    var newDay = day;
    var newYear = year;

    if (newMonth < 1) {
        newMonth = newMonth + 12;
        newYear = newYear - 1;
    }

    newsDate = newYear + "-" + newMonth + "-" + newDay;
    console.log(newsDate);
} */


var latlng = {"lat": 35.0116363, "lng": 135.7680294}


// Code & Listeners

$(document).ready(function() {
    userDestinationString = localStorage.getItem("destination");
    userDestination = userDestinationString.split(",");

    for (var i = 0; i < userDestination.length; i++) {
        userDestination[i] = userDestination[i].trim();
    }


    if (userDestination.length > 2) {
        userDestination.splice(1, userDestination.length - 2);
        console.log(userDestination);
    }

    

    $("#destination_name").text(userDestination[0] + ", " + userDestination[1]);

    googlePlacesQuery();
    wikipediaQuery();
    countryInfoQuery();
    newsQuery();

    console.log(latlng);








});



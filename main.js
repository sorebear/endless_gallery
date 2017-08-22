/**
 * Global Variable to store all previously generated Painting Objects
 * @Global {Array} of {Objects}
 */
var allPaintings = [];

/**
 * Global Variable to store all previously Painting Objects viewed by the user
 * @Global {Array} of {Objects}
 */
var allViewedPaintings = [];

/**
 * AJAX call to Artsy to receive random artwork with information
 * @param {string} "sample" and requires XAPP token
 * @return {JSON} Paiting image, painting title, painting ID, and gallery name (with conditional to check if empty)
 */
function getNewPainting(){
    $.ajax({ //Random artwork lookup
        url: "https://api.artsy.net/api/artworks?sample",
        method: "GET",
        dataType: "json",
        headers: {
            "X-Xapp-Token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6IiIsImV4cCI6MTUwMzk0NzkxNiwiaWF0IjoxNTAzMzQzMTE2LCJhdWQiOiI1OTliMzIwYzljMThkYjZmNzlkN2ViNmYiLCJpc3MiOiJHcmF2aXR5IiwianRpIjoiNTk5YjMyMGNhMDlhNjcxN2RhYjdiZmIyIn0.kN3DSO2Ppf1o6kbAJ6lkQw_TCSCxIAoWxjc9en2WXNE",
        },
        success: getPaintingArtist,
        error: errorFunction
    });
}

/**
 * AJAX call to Artsy to recieve Artist name and portrait from the painting ID
 * @param {string} painting ID and XAPP token
 * @return {JSON} Artist name and artist image
 */
function getPaintingArtist(response) {
    if (response.collecting_institution === "") {
        return getNewPainting();
    }
    var painting = new Painting();
    allPaintings.unshift(painting);
    allPaintings[0].paintingID = response.id;
    allPaintings[0].paintingTitle = response.title;
    allPaintings[0].paintingImage = allPaintings[0].setPaintingSize(response._links.image.href, "large");
    allPaintings[0].paintingGallery = response.collecting_institution;
    $.ajax({  //Artist Lookup
        url: "https://api.artsy.net/api/artists?sample",
        method: "GET",
        dataType: "json",
        data: {
            "artwork_id": response.id
        },
        headers: {
            "X-Xapp-Token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6IiIsImV4cCI6MTUwMzk0NzkxNiwiaWF0IjoxNTAzMzQzMTE2LCJhdWQiOiI1OTliMzIwYzljMThkYjZmNzlkN2ViNmYiLCJpc3MiOiJHcmF2aXR5IiwianRpIjoiNTk5YjMyMGNhMDlhNjcxN2RhYjdiZmIyIn0.kN3DSO2Ppf1o6kbAJ6lkQw_TCSCxIAoWxjc9en2WXNE",
        },
        success: getGalleryLocation,
        error: errorFunction
    });
}

/**
 * AJAX call to Google Geocoding to show the location of the home gallery
 * @param {string} Home gallery name
 * @return {number} Latitude and Longitude of the gallery
 */
function getGalleryLocation(response) {
    allPaintings[0].artistImage = allPaintings[0].setPaintingSize(response._links.image.href, "square");
    allPaintings[0].artistName = response.name;
    $.ajax({ //Geocoding API
        url: "https://maps.googleapis.com/maps/api/geocode/json",
        method: "GET",
        dataType: "json",
        data: {
            address: allPaintings[0].replaceXwithY(allPaintings[0].paintingGallery, " ", "+"),
            key: "AIzaSyAaECqfgaoi_qM2RBsq8VYAuuFevWg3bhg"
        },
        success: getArtistBio,
        error: errorFunction
    });
}

/**
 * AJAX call to Google Maps to display a map of the painting's housing gallery
 * @param {number} Latitude and Longitude of the housing gallery
 * @return {jQuery Object} jQuery wrapped DOM element to add to container div
 */
function getGalleryMap(lat, long){
    var urlStr = "https://www.google.com/maps/embed/v1/view?key=AIzaSyDWPRK37JSNxBhmLhEbWzCQ57MQBQu8atk&center=" + lat + "," + long + "&zoom=18&maptype=satellite";
    var iframeElement = $('<iframe>',{
        frameborder: "0",
        style: "border:0",
        src: urlStr
    });
    iframeElement.css({"width":"100%", "height":"100%"});
    //$(".map_container_div").append(iframeElement);
    return iframeElement;
}


/**
 * AJAX call
 * @param {string} Artist's name
 * @return {JSON} Artist's short biography from Wikipedia
 */
function getArtistBio(response) {
    allPaintings[0].galleryCoordinates.latitude = response.results[0].geometry.location.lat;
    allPaintings[0].galleryCoordinates.longitude = response.results[0].geometry.location.lng;
    $.ajax({ //get first passage of Wikipedia of Artist
        url: "https://en.wikipedia.org/w/api.php",
        method: "GET",
        dataType: "jsonp",
        data: {
            action: "query",
            titles: allPaintings[0].artistName,
            format: "json",
            prop: "extracts",
            exintro: true,
            explaintext: true
        },
        success: successFunction,
        error: errorFunction
    });
}

function successFunction (response) {
    var pageKey = Object.keys(response.query.pages);
    allPaintings[0].artistBiography = response.query.pages[pageKey[0]].extract;
    $("#artistName").text(allPaintings[0].artistName);
    $("#artistBio").text(allPaintings[0].artistBiography);
    $("#artistBio").scrollTop(0);
    console.log(allPaintings);
    var mapElement = getGalleryMap(allPaintings[0].galleryCoordinates.latitude, allPaintings[0].galleryCoordinates.longitude);
}
function errorFunction(){
    console.log("whoops");
}

/**
 * Creates an instance of Painting
 *
 * @constructor
 * @this {Painting}
 */
function Painting() {
    /**
     * @Private Image of the Painting
     */
    this.paintingImage = null;

    /**
     * @Private Title of the Painting
     */
    this.paintingTitle = null;

    /**
     * @Private Artist Name
     */
    this.artistName = null;

    /**
     * @Private Artist Portrait
     */
    this.artistImage = null;

    /**
     * @Private Artist Bio
     */
    this.artistBiography = null;

    /**
     * @Private Painting Gallery
     */
    this.paintingGallery = null;

    /**
     * @private Latitude and Longitude of the Gallery
     */
    this.galleryCoordinates = {
        latitude: null,
        longitude: null
    };

    /**
     * @private ID of the Painting
     */
    this.paintingID = null;

    /**
     * Method to create a DOM image
     * @Param {string, string} What image to target and where to append the DOM image to
     */
    this.createImageDOM = function(targetImage, appendTarget) {
        $(appendTarget).css('background-image', 'url(' + targetImage +')');
    };

    /**
     * Method that calls all of the Methods to add DOM elements to the page
     */
    this.populatePage = function() {
        this.createImageDOM(this.paintingImage, '.painting_div');
        this.createImageDOM(this.artistImage, '.artist_container_div');
    };
    /*
     * Method to take in a string and return it with all instances of "x" replaced with "y"
     * @param {string, string, string}
     * @return {string}
     */
    this.replaceXwithY = function(string, x, y) {
        return string.split(x).join(y);
    };

    /*
     * Method to take in a url in string format and return it with default image_version placeholder replaced with desired image size
     * @param {string, string}
     * @return {string}
     */
    this.setPaintingSize = function(url, size) {
        return url.replace("{image_version}", size)
    }
}

$(document).ready(function() {
    $('.generateNewPainting').on('click', getNewPainting);
});
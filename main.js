var testOjbect = {};

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
        success: successFunction,
        error: errorFunction
    });
}

/**
 * AJAX call to Artsy to recieve Artist name and portrait from the painting ID
 * @param {string} painting ID and XAPP token
 * @return {JSON} Artist name and artist image
 */
function getPaintingArtist() {
    $.ajax({  //Artist Lookup
        url: "https://api.artsy.net/api/artists?sample",
        method: "GET",
        dataType: "json",
        data: {
            "artwork_id": "516ca55d078b32147800075c"
        },
        headers: {
            "X-Xapp-Token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6IiIsImV4cCI6MTUwMzk0NzkxNiwiaWF0IjoxNTAzMzQzMTE2LCJhdWQiOiI1OTliMzIwYzljMThkYjZmNzlkN2ViNmYiLCJpc3MiOiJHcmF2aXR5IiwianRpIjoiNTk5YjMyMGNhMDlhNjcxN2RhYjdiZmIyIn0.kN3DSO2Ppf1o6kbAJ6lkQw_TCSCxIAoWxjc9en2WXNE",
        },
        success: successFunction,
        error: errorFunction
    });
}

/**
 * AJAX call to Google Geocoding to show the location of the home gallery
 * @param {string} Home gallery name
 * @return {number} Latitude and Longitude of the gallery
 */
function getGalleryLocation() {
    $.ajax({ //Geocoding API
        url: "https://maps.googleapis.com/maps/api/geocode/json",
        method: "GET",
        dataType: "json",
        data: {
            address: "The+White+House",
            key: "AIzaSyAaECqfgaoi_qM2RBsq8VYAuuFevWg3bhg"
        },
        success: successFunction,
        error: errorFunction
    });
}

/**
 * AJAX call to Google Maps to display a map of the painting's housing gallery
 * @param {number} Latitude and Longitude of the housing gallery
 * @return undefined
 */


/**
 * AJAX call
 * @param {string} Artist's name
 * @return {JSON} Artist's short biography from Wikipedia
 */
function getArtistBio() {
    $.ajax({ //get first passage of Wikipedia of Artist
        url: "https://en.wikipedia.org/w/api.php",
        method: "GET",
        dataType: "jsonp",
        data: {
            action: "query",
            titles: "Vincent van Gogh",
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
    console.log(response);
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
    this.galleryCoordinates = null;

    /**
     * @private ID of the Painting
     */
    this.paintingID = null;

    /**
     * Method to determine if paintingImage is portrait or landscape
     * @returns {string}
     */
    this.isImagePortraitOrLandscape = function(img) {
        var width = img[0].width;
        var height = img[0].height;
        if (height > width) {
            console.log('Portrait');
            return 'portrait'
        } else {
            console.log('Landscape');
            return 'landscape'
        }
    };

    /**
     * Method to set Painting Size
     * @param {string} image URL
     * @return {string} with the section surrounded by curly braces replaced with 'Large'
     */


    /**
     * Method to create a DOM image
     * @Param {string, string} What image to target and where to append the DOM image to
     */
    this.createImageDOM = function(targetImage, appendTarget) {
        var newImage = $('<img>').attr('src', targetImage);
        $(appendTarget).append(newImage);
        var orientation = this.isImagePortraitOrLandscape(newImage);
        if (orientation === 'portrait') {
            newImage.css('height', '100%');
        } else {
            newImage.css('width', '100%');
        }
    };

    /*
     * Method to take in a string and return it with all instances of "x" replaced with "y"
     * @param {string, string, string}
     * @return {string}
     */
    this.replaceXwithY = function(string, x, y) {
        return string.split(x).join(y);
    }
}

$(document).ready(function() {
    $('.generateNewPainting').on('click', getNewPainting);
});
require("dotenv").config();

var Spotify = require("node-spotify-api");
var request = require("request");
var moment = require("moment");
var keys = require("./keys.js");
var fs = require("fs");

var spotifyKeys = new Spotify(keys.spotify);

// assumes user set up completed (api keys, etc.)

// get the user input
const input = process.argv[2];

// make decision based on command
switch (input) {
    case "concert-this":
        concertThis ();
        break;    
    case "spotify-this-song":
        spotifyThisSong ();
        break;
    case "movie-this":
        movieThis ();
        break;
    case "do-what-it-says":
        doWhatItSays ();
        break;
    default: 
        console.log("I don't understand, ask the Foogle-Bot");
        break;
}

function concertThis () {
    console.log("Concert this");
}

function spotifyThisSong () {
    console.log("Spotify this song: " + process.argv[3]);
}

function movieThis () {
    console.log("Movie this");
}

function doWhatItSays () {
    console.log("Do what it says");
}
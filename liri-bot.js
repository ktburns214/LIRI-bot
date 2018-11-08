require("dotenv").config();

var Spotify = require("node-spotify-api");
var request = require("request");
var moment = require("moment");
var keys = require("./keys.js");
var fs = require("fs");

var spotifyKeys = new Spotify(keys.spotify);

const input = process.argv[2];

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
    let artist = "";

    request("https://rest.bandsintown.com/artists/" + artist + "/events/?app_id=codingbootcamp", function (error, response, body) {
        if (error) {
            console.log(error);
        } else if (response.statusCode === 200) {
            console.log(`\n`);
            console.log(`SEARCHING FOR ${artist}`)
            console.log(`\n`);
            const results = JSON.parse(body);

            for (let i = 0; i < results.length; i++) {
                console.log(`----- EVENT ${i} -----`);

                let location = "";

                if (results[i].venue.city != "") {
                    location += results[i].venue.city;
                }

                if (results[i].venue.region != "") {
                    location += ", ";
                    location += results[i].venue.region;
                }

                if (results[i].venue.country != "") {
                    location += ". ";
                    location += results[i].venue.country;
                }

                console.log(location);
                console.log(results[i].venue.name);
                let timeChange = moment(results[i].datetime).format("MMM Do YYYY");
                console.log(timeChange);
                console.log(`\n`);

                let logItem = {
                    request: "concert-this",
                    param: whichArtist,
                    location: location,
                    venue: results[i].venue.name,
                    time: timeChange
                }
};

function spotifyThisSong () {
    console.log("Spotify this song: " + process.argv[3]);
    let song = "";

    spotifyKeys.search({ type: "track", query: song }, function (error, data) {
        if (error) {
            console.log(error);
        }

        console.log(`\n\n`);
        console.log("Artist: " + data.tracks.items[0].artists[0].name);
        console.log("Song: " + data.tracks.items[0].name);
        console.log("Album: " + data.tracks.items[0].album.name)
        console.log("Preview Link: " + data.tracks.items[0].preview_url);

        let logItem = {
            request: "spotify-this-song",
            artist: data.tracks.items[0].artists[0].name,
            song: data.tracks.items[0].name,
            album: data.tracks.items[0].album.name,
            preview: data.tracks.items[0].preview_url
}

function movieThis () {
    console.log("Movie this");
    let movie = "";
    if (search === "") {
        movie = "Mr+Nobody";
    } else {
        movie = search;
    }

    request("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=65fea01f", function (error, response, body) {
        if (error) {
            console.log(error);
        } else if (response.statusCode === 200) {

            let logItem = {
                request: "movie-this",
                title: JSON.parse(body).Title,
                year: JSON.parse(body).Year,
                country: JSON.parse(body).Country,
                language: JSON.parse(body).Language,
                plot: JSON.parse(body).Plot,
                actors: JSON.parse(body).Actors
            }

            console.log(`\n\n`);
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Year: " + JSON.parse(body).Year);

            const ratings = JSON.parse(body).Ratings;
            ratings.forEach(function (index) {
                if (index.Source === "Internet Movie Database") {
                    console.log("IMDB Rating: " + index.Value);;
                    logItem.IMDB = index.Value;
                } else if (index.Source === "Rotten Tomatoes") {
                    console.log("Rotten Tommatoes Rating: " + index.Value);
                    logItem.rtRating = index.Value;
                }
            });

            console.log("Country: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);

}

function doWhatItSays () {
    console.log("Do what it says");
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error)
    }
    
    data = data.split("\n");
        const doWhatItSays = Math.floor(Math.floor(Math.random() * 3))
        let task = data[doWhatItSays].split(",");
        if (task[0] === "concert-this") {
            concertThis(task[1]);
        } else if (task[0] === "spotify-this-song") {
            spotifyThisSong(task[1]);
        } else if (task[0] === "movie-this") {
            movieThis(task[1]);
        }
    }

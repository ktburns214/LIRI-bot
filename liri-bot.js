require("dotenv").config();

const Spotify = require("node-spotify-api");
const request = require("request");
const moment = require("moment");
const keys = require("./keys.js");
const fs = require("fs");

let spotify = new Spotify(keys.spotify);

let inputCommand = process.argv[2];
let searchParam = process.argv.slice(3).join(" ");

searchLiri(inputCommand, searchParam.trim());

function searchLiri(command, search) {
    if (command === "concert-this") {
        liriConcert(search);
    } else if (command === "spotify-this-song") {
        liriSpotify(search);
    } else if (command === "movie-this") {
        liriMovie(search);
    } else if (command === "do-what-it-says") {
        liriRandom();
    } else {
        console.log(`\n\nWrong input.  You're options are: \n- concert-this\n- spotify-this-song\n- movie-this\n- do-what-it-says`);
    }
}

function liriConcert(search) {
    let whichArtist = "";
    if (search === "") {
        whichArtist = "Taylor Swift";
    } else {
        whichArtist = search;
    }

    request("https://rest.bandsintown.com/artists/" + whichArtist + "/events/?app_id=codingbootcamp", function (error, response, body) {
        if (error) {
            console.log(error);
        } else if (response.statusCode === 200) {
            console.log(`\n`);
            console.log(`SEARCHING FOR ${whichArtist}`)
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

                fs.appendFile("log.txt", JSON.stringify(logItem, null, 2), function (err) {
                    if (err) {
                        console.log(err);
                    }

                    else {
                        
                    }

                });
            }
        }
    });

}

function liriMovie(search) {
    let whichMovie = "";
    if (search === "") {
        whichMovie = "Mr+Nobody";
    } else {
        whichMovie = search;
    }

    request("http://www.omdbapi.com/?t=" + whichMovie + "&y=&plot=short&apikey=168f295", function (error, response, body) {
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

            fs.appendFile("log.txt", JSON.stringify(logItem, null, 2), function (err) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("Content Added to Log!");
                }

            });
        }
    });
}

function liriSpotify(search) {
    let whichSong = "";
    if (search === "") {
        whichSong = "The Sign";
    } else {
        whichSong = search;
    }

    spotify.search({ type: "track", query: whichSong }, function (error, data) {
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
        fs.appendFile("log.txt", JSON.stringify(logItem, null, 2), function(err) {
            if (err) {
              console.log(err);
            }
          
            else {
              console.log("Content Added to Log!");
            }
          
          });

    })
}

function liriRandom() {
    fs.readFile("random.text", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }

        data = data.split("\n");
        const randomTask = Math.floor(Math.floor(Math.random() * 3))
        let whichTask = data[randomTask].split(",");
        if (whichTask[0] === "concert-this") {
            liriConcert(whichTask[1]);
        } else if (whichTask[0] === "spotify-this-song") {
            liriSpotify(whichTask[1]);
        } else if (whichTask[0] === "movie-this") {
            liriMovie(whichTask[1]);
        }
    });
}
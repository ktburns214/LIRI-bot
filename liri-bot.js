// assumes user set up completed (api keys, etc.)

// get the user input
const input = process.argv[2];

// make decision based on command
switch (input) {
    case "consert-this":
        consertThis ();
        break;
    
    case "spotify-this-song":
        spotifyThisSong ();
        break;

    default: 
        console.log("I don't understand, ask the Foogle-Bot");
        break;
}

function consertThis () {
    console.log("Consert this");
}

function spotifyThisSong () {
    console.log("Spotify this song: " + process.argv[3]);
}
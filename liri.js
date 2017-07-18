


//================= start of storing arguments into variables section ============================

// initialize liriInstruction and argument argName variable for either Song Name or Movie Name.
var liriInstruction = "";
var argName = "";

var totalArg = process.argv.length;
// validate if there are enough arguments.

if (totalArg < 3){
	console.log("Need argument: my-tweets, spotify-this-song '<song>', movie-this '<movie>', or do-what-it-says.");
	process.exit();
};

// we first assign the instruction in temporary variable to be used for the following case section.
var liriTemp = process.argv[2];

// Now, we assign arguments to more permanent valiables.  Instructions to liriInstruction and arguments in argName variable.

switch (liriTemp) {
    case "do-what-it-says":
		// fs is a core Node package for reading and writing files
		var fs = require("fs");
		// This block of code will read from the "random.txt" file.
		// It's important to include the "utf8" parameter or the code will provide stream data (garbage)
		// The code will store the contents of the reading inside the variable "data"
		fs.readFile("random.txt", "utf8", function(error, data) {
		// If the code experiences any errors it will log the error to the console.
			if (error) {
				return console.log(error);
  			}
			// We will then print the contents of data
  			//console.log(data);
  			// Then split it by commas (to make it more readable)
  			var dataArr = data.split(",");
  			// We will then put them in the variables liriCommand and argName for later use.
  			//console.log("dataArr[0]: " +dataArr[0]);
  			//console.log("dataArr[1]: " + dataArr[1]);
  	
  			liriInstruction = dataArr[0];
			argName = dataArr[1];

			console.log("liriInstruction from random.txt: " + liriInstruction);
			console.log("argName combined from from random.txt: " + argName);
		});

		break;
    default: 	
		//now this condition is to manage other liri commands.  
		// here we also test if there is more than 3 arguments. 
		// Example, if the command line is: node liri.js spotify-this-song Material Girl, argName should store "Material Girl" string.
		liriInstruction = process.argv[2];

		var totalArg = process.argv.length;

		// following code concatinates the arguments after the liriInstruction
		//console.log("Total Arguments: " + totalArg);

		if (totalArg > 4) {
 			console.log("Entered array pushing;");
  			for (var i=3; i<totalArg; i++){
				argName = argName.concat(process.argv[i] + " ");
			};
		} else {
 			argName = process.argv[3];
 		};
		console.log("liriInstruction from default: " + liriInstruction);
		console.log("argName combined from default: " + argName); 		
	};
// From here, we have completed putting the variables into 2 variables... liriInstruction and argName (Song Name or Movie Name).

//================= end of storing arguments into variables section ==============================


switch (liriInstruction) {
    case "my-tweets":
    	// grab the variables from keys.js file.
		var Keys = require("./keys.js");
		// Get all of keys and access tokens from keys file and assign to a variable.
		var keysTokens = Keys.twitterKeys;

		var Twitter = require('twitter');
		var client = new Twitter({
			consumer_key: keysTokens.consumer_key,
  			consumer_secret: keysTokens.consumer_secret,
  			access_token_key: keysTokens.access_token_key,
  			access_token_secret: keysTokens.access_token_secret
			});

    	// set up Twitter API GET parameter
		var params = {screen_name: 'fenix_jet', count: 20};

		client.get('statuses/user_timeline', params, function(error, tweets, response){
  			if (!error) {
  				var arrayLength = tweets.length
  				for (i=0; i < arrayLength;i++){
 		   			console.log(tweets[i].created_at + " --> " + tweets[i].text);
  				}
			} else {
  				console.log('Error occurred: ' + error);
  			};
		});
        break; 
    case "spotify-this-song":
    	// grab the variables from keys.js file.
		var Keys = require("./keys.js");
		// Get all of keys and access tokens from keys file and assign to a variable.
		var keysTokens = Keys.spotifyKeys;

    	var Spotify = require('node-spotify-api');

    	var client = new Spotify({
  			id: keysTokens.client_Id,
  			secret: keysTokens.client_secret
    	});

    	// if a song name is given, store it in a variable called "songName".
    	if (argName) {
   			var songName = argName;
   		} else {
   			var songName = "The Sign";
   		};

   		//console.log(songName);

   		// for testing, set limit to lower number i.e. 2.  After testing, I am setting the limit to just 5.
    	client.search({ type: 'track', query: songName, limit: 5 }, function(err, data) {
  			if (err) {
    			return console.log('Error occurred: ' + err);
  			};
			// We use JSON.stringify to print the data in string format.
  			// We use the JSON.stringify argument of "2" to make the format pretty. 
  			// Purpose for this is for us to see the data for testing/validation.
			// console.log(JSON.stringify(data, null, 2)); 

			// check length of array (number of items found by api search).
  			var arrayLength = data.tracks.items.length

  			// loop and print each required data based on the number or items found.
  			for (i=0; i < arrayLength;i++){

				// Artist(s)
				// The song's name
				// A preview link of the song from Spotify
				// The album that the song is from
				console.log("========== *** Album/Artist *** ===========");
				console.log("Artist: " + data.tracks.items[i].artists[0].name);
				console.log("Song: " + data.tracks.items[i].name);			
				console.log("Preview URL: " + data.tracks.items[i].preview_url);
				console.log("Album: " + data.tracks.items[i].album.name);
				console.log("");
			};
			console.log("==== *** Limiting to 5 records... *** =====")
		});
        break; 
    case "movie-this":
    	// call on request npm
		var request = require("request");
    	// if a movie name is given, store it in a variable called "movieName".
    	if (argName) {
    	   			var movieName = argName;
   		} else {
   			var movieName = "Mr. Nobody";
   		};
   		// Then run a request to the OMDB API with the movie specified
		var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";
		// Then create a request to the queryUrl
		request(queryUrl, function(error, response, body) {
			// Check if request is successful
			if (!error && response.statusCode === 200) {
				console.log("========= *** Movie Details *** ===========");
				console.log("Title: " + JSON.parse(body).Title);
				console.log("Year: " + JSON.parse(body).Year);
				console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
				// Rotten Tomatoes Rating is the 2nd object of Ratings array
				console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
				console.log("Country where movie was produced: " + JSON.parse(body).Country);
				console.log("Language: " + JSON.parse(body).Language);
				console.log("Plot: " + JSON.parse(body).Plot);
				console.log("Actors: " + JSON.parse(body).Actors);
  			};
		});
//    	http://www.omdbapi.com/?t=scream&y=&plot=short&apikey=40e9cece
        break;      
  //   case "do-what-it-says":

  // 	Problem with asynchronous wherein fs.readFile is read only after the last line of code below runs.

		// // fs is a core Node package for reading and writing files
		// var fs = require("fs");
		// // This block of code will read from the "random.txt" file.
		// // It's important to include the "utf8" parameter or the code will provide stream data (garbage)
		// // The code will store the contents of the reading inside the variable "data"
		// fs.readFile("random.txt", "utf8", function(error, data) {
		// // If the code experiences any errors it will log the error to the console.
		// if (error) {
		// 	return console.log(error);
  // 		}
		// // We will then print the contents of data
  // 		//console.log(data);
  // 		// Then split it by commas (to make it more readable)
  // 		var dataArr = data.split(",");
  // 		// We will then display the content as an array for later use.
  // 		console.log(dataArr[0]);
  // 		console.log(dataArr[1]);
		// });

  //       break;
    default: 
        console.log("Valid arguments are: my-tweets, spotify-this-song '<song>', movie-this '<movie>', or do-what-it-says."); ;
};


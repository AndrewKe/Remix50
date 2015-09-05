var songData;

$(function() {
    console.log("Page loaded");
});

function loadRemixes() {
	var uri = location.search.split('track=')[1];

    console.log("Youtube loaded. Now displaying songs ...");

    $("#spotify_player").attr("src", "https://embed.spotify.com/?uri=" + "spotify:track:" + uri);

	$.getJSON("https://api.spotify.com/v1/tracks/" + uri, function(data)
    {
        console.log(data);
        songData = data;
        $("#title").html(data.name);
        $("#artist").html(data.artists[0].name);

        var queryString = data.artists[0].name + " live";

        console.log(queryString);

	    console.log("Loading youtube remixes...");
		var request = gapi.client.youtube.search.list({
		  q: queryString,
		  part: 'snippet',
		  order: 'relevance',
		  type: 'video',
		});

		console.log(request);

		request.execute(function(response) {
		  var videos = response.result.items
		  console.log(videos);

		  var firstId = videos[0].id.videoId
		  $("#youtubeMain").attr("src","https://www.youtube.com/embed/" + firstId);
		});

		

    });


}

function init() {
	console.log("Setting up api key ...");
    gapi.client.setApiKey("AIzaSyAkhR6ZrwzGICqG21DlyYyOHHvgLQCFb3g");
    gapi.client.load("youtube", "v3", function() {
        loadRemixes();
    });
}
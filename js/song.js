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

        var queryString =  data.artists[0].name + " " + data.name; 

        console.log(queryString);

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

		// Remixes

		var remixQuery = queryString 
		remixQuery =remixQuery.replace("Radio", '');
		remixQuery =remixQuery.replace("Edit", '');
		remixQuery =remixQuery.replace("radio", '');
		remixQuery =remixQuery.replace("edit", '');

		console.log(remixQuery);
		var remixRequest = gapi.client.youtube.search.list({
		  q: remixQuery + " remix",
		  part: 'snippet',
		  order: 'relevance',
		  type: 'video',
		  maxResults: 20
		});

		remixRequest.execute(function(response) {
		  var videos = response.result.items
		  console.log("test");
		  console.log(response.result.items);

			var table = $("#song_table");
	        $("#song_table").find("tr:gt(0)").remove();
	        for (var item in videos)
	        {
	        	console.log(item);
	            var song = videos[item];
	            content = "<tr>";
	            content += "<td><iframe src=\"" + "https://www.youtube.com/embed/" + song.id.videoId + "\"width=\"300\" height=\"380\" frameborder=\"0\" allowtransparency=\"true\"></iframe></td>"
	            content += "<td>" + song.snippet.title + "</td>";

	            content += "</tr>";
	            table.append(content);
	        }

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
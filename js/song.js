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

        var queryString = data.name + " " + data.artists[0].name; 

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

		var remixQuery = queryString + " remix"

		var remixRequest = gapi.client.youtube.search.list({
		  q: remixQuery,
		  part: 'snippet',
		  order: 'relevance',
		  type: 'video',
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
	            var song = data[item];
	            var content = "<tr class = song_row data-href=song.html?track=" + song["id"] + ">";

	            $('tr[data-href]').on("click", function() {
	                document.location = $(this).data('href');
	            });

	            $()

	            var albumImageURL = song["album"]["images"][2]["url"];

	            content += "<td class = \"song_cell_data\"> <img src = \"" + albumImageURL + "\"> </td>";
	            content += "<td class = \"song_cell_data\">" + song["name"] + "</td>";

	            content += "<td class = \"song_cell_data\">" + song["album"]["name"] + "</td>";

	            content += "<td class = \"song_cell_data\">" + song["artists"][0]["name"] + "</td>";
	            content += "<td class = \"song_cell_data\">" + song["popularity"] + "</td>";

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
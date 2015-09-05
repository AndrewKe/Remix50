/**
 * search.js
 *
 * Computer Science 50
 * Final Project
 *
 * Global JavaScript.
 */

// execute when the DOM is fully loaded
$(function() {
    console.log("Page loaded");

    $("#form").submit(searchSongs);

    if($("#q").val() != "")
    {
        searchSongs();
    }
});

function searchSongs()
{
    $.getJSON("spotify_search.php", {q: $("#q").val()}, function(data)
    {
        var table = $("#song_table");
        $("#song_table").find("tr:gt(0)").remove();
        for (var item in data)
        {

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
}




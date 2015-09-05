<?php

    // ensure proper usage
    if (empty($_GET["q"]))
    {
        http_response_code(400);
        exit;
    }

    // escape user's input
    $query = urlencode($_GET["q"]);
    // numerically indexed array of articles
    $result = [];
    
    $contents = @file_get_contents("https://api.spotify.com/v1/search?q={$query}&type=track&limit=40", true);
    if ($contents === false)
    {
        http_response_code(503);
        exit;
    }

    $result = json_decode($contents, true);
    // output articles as JSON (pretty-printed for debugging convenience)
    header("Content-type: application/json");
    print(json_encode($result["tracks"]["items"], JSON_PRETTY_PRINT));

?>

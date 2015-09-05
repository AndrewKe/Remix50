<?php

    require(__DIR__ . "/../includes/config.php");

    // numerically indexed array of places
    $places = [];

    // Example: Cambridge, Massachusets
    $queryString = $_GET["geo"];

    // split by all non-alpha numeric characters
    $split = preg_split("/[^a-zA-Z\d]/", $queryString, -1, PREG_SPLIT_NO_EMPTY);    


    // See if the last elment is a zip code
    $last = array_pop($split);
    $zipCode = -1;

    if (is_numeric($last)){
        $zipCode = intval($last);
    }
    else
    {
        array_push($split, $last);
    }

    // Implode the parts back together after checking for zip code
    $placeString = implode(" ", $split);


    //search database for places matching $_GET["geo"]

    // locations where zip code does not match but placeString does. 
    $queryResultNoZip = query("SELECT * FROM places WHERE MATCH (place_name, admin_name1, admin_code1,admin_name2, admin_code2, admin_name3, admin_code3) AGAINST (? IN NATURAL LANGUAGE MODE) AND postal_code != $zipCode", $placeString);
    
    // locations wehre zip code matches, but placeString does not. 
    $queryResultOnlyZip = query("SELECT * FROM places WHERE NOT MATCH (place_name, admin_name1, admin_code1,admin_name2, admin_code2, admin_name3, admin_code3) AGAINST (? IN NATURAL LANGUAGE MODE) AND postal_code = $zipCode", $placeString);

    // highest priority locations where both match
    $queryResultWithZip = query("SELECT * FROM places WHERE MATCH (place_name, admin_name1, admin_code1,admin_name2, admin_code2, admin_name3, admin_code3) AGAINST (? IN NATURAL LANGUAGE MODE) AND postal_code = $zipCode", $placeString);

    // merge the three parts in order of priority into one aray
    $places = array_merge($queryResultWithZip, $queryResultOnlyZip, $queryResultNoZip);

    // output places as JSON (pretty-printed for debugging convenience)
    header("Content-type: application/json");
    print(json_encode($places, JSON_PRETTY_PRINT));

?>

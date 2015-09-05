<?php

    require(__DIR__ . "/../includes/config.php");

    // numerically indexed array of places
    $places = [];
    //query("ALTER TABLE places ADD FULTEXT (place_name, admin_name1, admin_code1,admin_name2, admin_code2, admin_name3, admin_code3)");
    $queryString = $_GET["geo"];
    $split = preg_split("/[^a-zA-Z\d]/", $queryString, -1, PREG_SPLIT_NO_EMPTY);    

    $last = array_pop($split);
    $zipCode = -1;

    if (is_numeric($last)){
        $zipCode = intval($last);
    }
    else
    {
        array_push($split, $last);
    }


    $placeString = implode(" ", $split);
    //print($placeString . "\n");

    //var_dump($zipCode);
    //var_dump($split);

    // TODO: search database for places matching $_GET["geo"]
    $queryResultNoZip = query("SELECT * FROM places WHERE MATCH (place_name, admin_name1, admin_code1,admin_name2, admin_code2, admin_name3, admin_code3) AGAINST (? IN NATURAL LANGUAGE MODE) AND postal_code != $zipCode", $placeString);
    //var_dump($queryResultNoZip);
    $queryResultOnlyZip = query("SELECT * FROM places WHERE NOT MATCH (place_name, admin_name1, admin_code1,admin_name2, admin_code2, admin_name3, admin_code3) AGAINST (? IN NATURAL LANGUAGE MODE) AND postal_code = $zipCode", $placeString);
    $queryResultWithZip = query("SELECT * FROM places WHERE MATCH (place_name, admin_name1, admin_code1,admin_name2, admin_code2, admin_name3, admin_code3) AGAINST (? IN NATURAL LANGUAGE MODE) AND postal_code = $zipCode", $placeString);
    //var_dump($queryResultOnlyZip, $queryResultWithZip);
    $places = array_merge($queryResultWithZip, $queryResultOnlyZip, $queryResultNoZip);
    //var_dump($places);
    // output places as JSON (pretty-printed for debugging convenience)
    header("Content-type: application/json");
    print(json_encode($places, JSON_PRETTY_PRINT));

?>

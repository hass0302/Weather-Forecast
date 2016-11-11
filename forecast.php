<?php
header("Content-type: application/json");

$apikey = "3e98b79c9d3aaa7f94243d7a9425aa82"; 
//enter your DarkSky.net API key above

// create a new cURL resource
$ch = curl_init();
// set URL and other appropriate options
curl_setopt($ch, CURLOPT_URL, "https://api.darksky.net/forecast/". $apikey ."/45.462322, -75.534017?units=ca);
//ADD the proper value for UNITS to the end of the URL on the line above


curl_setopt($ch, CURLOPT_HEADER, 0);

// grab URL and pass it to the browser
curl_exec($ch);

// close cURL resource, and free up system resources
curl_close($ch);
?>
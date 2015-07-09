<?php
	include('tmdb-api.php');
	$root_name = "data";
	$array = array();
	if(!isset($_REQUEST['id']) || TRIM($_REQUEST['id']) == ''){
		$array["opcion"] = 2;
		$array["status_message"] = "The resource you requested could not be found.";
		echo json_encode($array);
	}
	else{
		$apikey = 'b452a69cd4b748e4c41a4109f4d91f8f';
		$tmdb = new TMDB($apikey); // by simply giving $apikey it sets the default lang to 'en'
		$id = $_REQUEST['id'];
		$array["opcion"] = 1;
		$persona = $tmdb->getPerson($id);
		$cast = array();
		foreach($persona->getMovieRoles() as $movies_rol){
			$movie = $tmdb->getMovie($movies_rol->getMovieID());
			$cast[] = array("poster_path" => $movie->getPoster(), "release_date" => $movies_rol->getMovieReleaseDate(), "original_title" => $movie->getTitle(), "character" => $movies_rol->getCharacter());
		}
		$array["cast"] = $cast;
		echo json_encode($array);
	}
?>
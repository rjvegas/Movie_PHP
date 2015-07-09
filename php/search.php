<?php
	include('tmdb-api.php');
	$root_name = "data";
	$array = array();
	if(!isset($_REQUEST['query']) || TRIM($_REQUEST['query']) == ''){
		$array["opcion"] = 2;
		$array["status_message"] = "The resource you requested could not be found.";
		echo json_encode($array);
	}
	else{
		$apikey = 'b452a69cd4b748e4c41a4109f4d91f8f';
		$tmdb = new TMDB($apikey); // by simply giving $apikey it sets the default lang to 'en'
		$name = $_REQUEST['query'];
		$persons = $tmdb->searchPerson($name);
		$array["opcion"] = 1;
		if(sizeof($persons) == 0)
			$array["results"] = array();
		else{
			foreach($persons as $person){
				$persona = $tmdb->getPerson($person->getID());
				$know_for = array();
				$movies = $persona->getMovieRoles();
				for($i=0; $i<sizeof($movies) && $i<4; $i++)
					$know_for[] = array("title" => $movies[$i]->getMovieTitle());
				$personaje = array("name" => $persona->getName(), "id" => $persona->getID(), "known_for" => $know_for, "profile_path" => $persona->getProfile());
				
				$array["results"][] = $personaje;
				
			}
		}
		echo json_encode($array);
	}
?>
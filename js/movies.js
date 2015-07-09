var table = null;
var personajes = null;
var mapPersonajes = null;

$( document ).ready(function() {
	
	function hideTooltip(){ 
        $("#mensaje_notificacion").hide("slow"); 
    }
	
	function successCB(datos){
		dat = $.parseJSON(datos);
		$.each(dat.cast, function (i, pelicula) {
			var poster = "";
			if(pelicula.poster_path && pelicula.poster_path !== '')
				poster = 'https://image.tmdb.org/t/p/w92'+pelicula.poster_path;
			release_date = "";
			if(pelicula.release_date && pelicula.release_date !== '')
				release_date = pelicula.release_date;
			table.row.add( {
				"fecha": release_date,
				"title": pelicula.original_title,
				"personaje": pelicula.character,
				"poster": poster
			}  ).order( [ 0, 'asc' ], [ 1, 'asc' ] ).draw();
		});
	}
	
	function errorCB(data){
		dat = $.parseJSON(data);
		$("#notificacion").html("<div id='mensaje_notificacion'><div class='alert alert-danger' role='alert'>"+dat.status_message+"</div></div>");
		setTimeout(hideTooltip, 5000);
	}
	
	function BuscarPeliculas(personaje){
		$.ajax({
			method: "post",
			url: "php/movies.php",
			data: {
				"id": personaje
			},
			beforeSend: function(jqXHR, settings){
                table.clear().draw();;
				$("#personajes").prop( "readonly", true );
            },
			success: function(data, textStatus, jqXHR){
				dat = $.parseJSON(data);
				if(dat.opcion === 2)
					errorCB(data);
				else
					successCB(data);
			},
			complete: function(jqXHR, textStatus){
                $("#personajes").prop( "readonly", false );
            }
		});			
	}
	
	$('#personajes').typeahead({
		source: function(query, process) {
			theMovieDb.search.getPerson({"query":query }, 
			function(data){
				dat = $.parseJSON(data);
				personajes = [];
				mapPersonajes = [];
				process([]);
				var personajesJ = dat.results;
				$.each(personajesJ, function (i, personaje) {
					mapPersonajes[personaje.name] = personaje;
					personajes.push(personaje.name);
				});
				process(personajes);
			}, errorCB);
		},
		matcher: function(item) {
			if (item.toLowerCase().indexOf(this.query.trim().toLowerCase()) !== -1)
				return true;
		},
		highlighter: function(item) {
			var personaje = mapPersonajes[item];
			var known_for = "";
			var known_forJ = personaje.known_for;
			$.each(known_forJ, function (i, pelicula) {
				if(known_for === ''){
					if(pelicula.title && pelicula.title !== '')
						known_for = pelicula.title;
				}
				else{
					if(pelicula.title && pelicula.title !== '')
						known_for += ", "+pelicula.title;
				}
			});
			if(known_for === '')
				known_for = "Sin pel&iacute;culas registradas";
			var respuesta = "<table border=0>";
			respuesta += "<tr>";
			respuesta += "<td rowspan='2'>";
			if(personaje.profile_path && personaje.profile_path !== '')
				respuesta += "<img src='https://image.tmdb.org/t/p/w92"+personaje.profile_path+"' height='40' width='40' />";
			else
				respuesta += "<img src='images/drama.png' height='40' width='40' />";
			respuesta += "</td>";
			respuesta += "<td>";
			respuesta += personaje.name;
			respuesta += "</td>";
			respuesta += "</tr>";
			respuesta += "<tr>";
			respuesta += "<td><code>";
			respuesta += known_for;
			respuesta += "</code></td>";
			respuesta += "</tr>";				
			respuesta += "</table>";
			return respuesta;
		},
		updater: function (item) {
			var personaje = mapPersonajes[item];
			BuscarPeliculas(personaje.id);
			return item;
		}
	});
	
	table = $('#peliculas').DataTable({
		"language": {
			"url": "json/spanish.json"
		},
		"columns": [
			{
				"data": "fecha",
                "render": function(data, type, row, meta){
					if(row.fecha === '')
						return "";
                    var res = row.fecha.split("-"); 
                    return res[2]+'/'+res[1]+'/'+res[0];
                }
			},
			{
				"data": "title"
			},
			{
				"data": "poster",
				"orderable": false,
                "searchable": false,
                "render": function(data, type, row, meta){
                    if(row.poster === '')
                        return "";
                    return "<img src='"+row.poster+"'/>";
                }
			},
			{
				"data": "personaje"
			}
		],
		"order": [[0, 'asc']]
	});
	
});
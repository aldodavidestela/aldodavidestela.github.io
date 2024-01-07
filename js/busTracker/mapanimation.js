var locations = [];
var buses;
var centro;
let sumaLat;
let sumaLng;
var markers;

async function createMap(){
	mapboxgl.accessToken = 'pk.eyJ1IjoiYWxkb2RhdmlkIiwiYSI6ImNscHhsNjUyZTBsdXoyanF3d21naDkxY3MifQ.pfFVv0Ojr_Dr7z1HansJCw';

	locations = await getBusLocations();

	buses = [];
	sumaLat = 0;
	sumaLng = 0;
	for (let i=0; i<locations.length; i++){
		sumaLat += locations[i].attributes.latitude;
		sumaLng += locations[i].attributes.longitude;
		let bus = {label: locations[i].attributes.label, location:{lng: locations[i].attributes.longitude, lat: locations[i].attributes.latitude}};
		buses.push(bus);
	}
	centro = {lng: sumaLng/buses.length, lat: sumaLat/buses.length};

	var map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/streets-v11',
	center: centro,
	zoom: 11
	});

	markers = [];
	for (let i=0; i<buses.length; i++){
		let marker = new mapboxgl.Marker();
		marker.setLngLat(buses[i].location);
		marker.setPopup(new mapboxgl.Popup().setHTML(buses[i].label))
		marker.addTo(map);
		markers.push(marker);
	}

}

async function run(){
    // get bus data    
	locations = await getBusLocations();
	
	buses = [];
	for (let i=0; i<locations.length; i++){
		let bus = {label: locations[i].attributes.label, location:{lng: locations[i].attributes.longitude, lat: locations[i].attributes.latitude}};
		buses.push(bus);
		markers[i].setLngLat(bus.location);
		markers[i].setPopup(new mapboxgl.Popup().setHTML(bus.label));
	}

	if (markers.length != buses.length){
		createMap();
	}

	// timer
	setTimeout(run, 15000);
}

// Request bus data from MBTA 
async function getBusLocations(){
	const url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';
	const response = await fetch(url);
	const json = await response.json();
	return json.data;
}


createMap();
run();
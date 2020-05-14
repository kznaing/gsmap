mapboxgl.accessToken = 'your-mapbox-access-token-here';

function getSheetID(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('sid');
}

var sid = getSheetID();

var gsheet_link = 'https://spreadsheets.google.com/feeds/list/'+ sid + '/1/public/values?alt=json';

function get(url){
	return new Promise(function(resolve, reject){
        let req = new XMLHttpRequest();
        req.open('GET',url);
        req.onload = function(){
            if(req.status==200){
                resolve(JSON.parse(req.response));
            }else{
                
            }
        };
        req.onerror = function(){
            reject("error");
        };
        req.send();
	});
}

function googlesheetJsonExtract(gsheetdata, columnNames){
	let entryData = gsheetdata.feed.entry;
	let finalJSON = [];
	for (i=0; i<entryData.length; i++){	
        let rawdata = entryData[i];
		let individualDataStr = "{";
		for (j=0; j<columnNames.length; j++){
			let jsonKey = "gsx$" + columnNames[j];
			individualDataStr = individualDataStr + '"' + columnNames[j] + '":' + '"' + rawdata[jsonKey]["$t"] +'",';
		}
		individualDataStr = individualDataStr.slice(0,-1);
        individualDataStr = individualDataStr + "}";
		finalJSON.push(JSON.parse(individualDataStr.replace(new RegExp('\n','g'),'\\n')));
	}
	return finalJSON;
}

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [96.289,21.358],
    zoom: 4
});

function addMarker(data) {
    var el = document.createElement('div');
    el.className = 'marker';
    if(!data.css_background){
        el.style.backgroundImage = "radial-gradient(green,green)";
    }else{
        el.style.backgroundImage = data.css_background;
    }

    new mapboxgl.Marker(el)
        .setLngLat([data.lng,data.lat])
        .setPopup(new mapboxgl.Popup({ offset: 25 }) 
            .setHTML('<h3>' + data.title + '</h3><p>' + data.description + '</p>'))
        .addTo(map);
}

get(gsheet_link).then(function(response){
    let sheet_data = googlesheetJsonExtract(response,["id","lng","lat","css_background","title","description"]);
    sheet_data.forEach(function(data){
        if(data.lng!='' && data.lat!=''){
            addMarker(data);
        }
    });
});
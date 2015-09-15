console.log('loading map.js');

var map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 34.1030032,
            lng: -118.4104684
        },
        zoom: 8
    });
}

function startup() {

    console.log('called startup');

    var xmlhttp = new XMLHttpRequest();
    var url = "facilities?zipcode=90210";

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var pins = JSON.parse(xmlhttp.responseText);

            pins.facilities.forEach(function (pin) {

                var position = {
                    lat: pin.lat,
                    lng: pin.lng
                };

                console.log(position);

                var marker = new google.maps.Marker({
                    position: position,
                    map: map,
                    title: pin.name
                });

                marker.setMap(map);
            })
        }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

}

function myFunction(arr) {
    var out = "";
    var i;
    for (i = 0; i < arr.length; i++) {
        out += '<a href="' + arr[i].url + '">' +
            arr[i].display + '</a><br>';
    }
}
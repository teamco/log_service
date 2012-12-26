var ge, placemark,
    sap = [32.1966, 34.88436],
    target = 'moon',
    boundParams, timeParams,
    clients =[];

function init() {
    showPlanet('earth');
}

function initCallback(instance) {
    $('#map3d').css({
        visibility: 'hidden'
    });

    ge = instance;

    addButton('Earth', goToEarth, 'right', 'earth');
    addButton('Fly to SAP', goSAP, 'right', 'home');
    addButton('Show Borders', showBorders, 'right', 'borders');
    addButton('Hide Borders', hideBorders, 'right', 'bordershide');

//    showSky();

//    ge = instance;
//
//    goSAPBtn();
//    showSky();

//    if (target === 'moon') {
//        setTimeout(function () {
//            ge.getWindow().setVisibility(true);
//            visAuto();
//            showSun();
//            target = 'earth';
//            showPlanet(target);
//        }, 15000);
//    }
//    else if (target === 'moon') {
//        setTimeout(function () {
//            ge.getWindow().setVisibility(true);
//            visAuto();
//            showSun();
//        }, 2000);
//    } else {
//        setTimeout(function () {
//            ge.getWindow().setVisibility(true);
//            showEarth();
//            visAuto();
//            showSun();
//            goSAP(6000);
//            setPlaceMark();
//        }, 15000);
//    }

}

function failureCallback(errorCode) {
    console.log(errorCode);
}

function showBorders() {
    ge.getLayerRoot().enableLayerById(ge.LAYER_BORDERS, true);
}

function hideBorders() {
    ge.getLayerRoot().enableLayerById(ge.LAYER_BORDERS, false);
}

function showRoads() {
    ge.getLayerRoot().enableLayerById(ge.LAYER_ROADS, true);
}

function showPlanet(target) {
    document.getElementById('map3d').innerHTML = '';
    switch (target) {
        case 'moon':
            google.earth.createInstance('map3d', initCallback, failureCallback, { database: 'http://khmdb.google.com/?db=moon' });
            break;
        case 'mars':
            google.earth.createInstance('map3d', initCallback, failureCallback, { database: 'http://khmdb.google.com/?db=mars' });
            break;
        default:
            google.earth.createInstance('map3d', initCallback, failureCallback);
            break;
    }
}

// visibility
function visShow() {
    ge.getNavigationControl().setVisibility(ge.VISIBILITY_SHOW);
}

function visAuto() {
    ge.getNavigationControl().setVisibility(ge.VISIBILITY_AUTO);
}

function visHide() {
    ge.getNavigationControl().setVisibility(ge.VISIBILITY_HIDE);
}

// position
function posTopLeft() {
    ge.getNavigationControl().getScreenXY().setXUnits(ge.UNITS_PIXELS);
    ge.getNavigationControl().getScreenXY().setYUnits(ge.UNITS_INSET_PIXELS);
}

function posTopRight() {
    ge.getNavigationControl().getScreenXY().setXUnits(ge.UNITS_INSET_PIXELS);
    ge.getNavigationControl().getScreenXY().setYUnits(ge.UNITS_INSET_PIXELS);
}

function posBottomLeft() {
    ge.getNavigationControl().getScreenXY().setXUnits(ge.UNITS_PIXELS);
    ge.getNavigationControl().getScreenXY().setYUnits(ge.UNITS_PIXELS);
}

function posBottomRight() {
    ge.getNavigationControl().getScreenXY().setXUnits(ge.UNITS_INSET_PIXELS);
    ge.getNavigationControl().getScreenXY().setYUnits(ge.UNITS_PIXELS);
}

function showSky() {
    ge.getOptions().setMapType(ge.MAP_TYPE_SKY);
    setTimeout(function () {
        removeCover();
        // Zoom in on a nebula.
        var oldFlyToSpeed = ge.getOptions().getFlyToSpeed();
        ge.getOptions().setFlyToSpeed(.2);  // Slow down the camera flyTo speed.
        var lookAt = ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND);
        lookAt.set(41.28509187215, -169.2448684551622, 0,
            ge.ALTITUDE_RELATIVE_TO_GROUND, 262.87, 0, 162401);
        ge.getView().setAbstractView(lookAt);
        ge.getOptions().setFlyToSpeed(oldFlyToSpeed);
    }, 1000); // Start the zoom-in after one second.

}

function removeCover() {
    $('#cover').fadeOut(1500, function () {
    });
    $('#map3d').css({
        visibility: 'visible'
    });
    $('#band-aid').fadeIn();
}

function showEarth() {
    removeCover();
    ge.getOptions().setMapType(ge.MAP_TYPE_EARTH);
    setTimeout(function () {
        var oldFlyToSpeed = ge.getOptions().getFlyToSpeed();
        ge.getOptions().setFlyToSpeed(.2);  // Slow down the camera flyTo speed.
        var lookAt = ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND);
        // latitude, longitude, altitude, altitudeMode, heading, tilt, range
        lookAt.set(sap[0], sap[1], 0,
            ge.ALTITUDE_RELATIVE_TO_GROUND, 0, 0, 162401);
        ge.getView().setAbstractView(lookAt);
        ge.getOptions().setFlyToSpeed(oldFlyToSpeed);

        google.earth.addEventListener(ge.getView(), 'viewchangeend', function (evt) {
            boundParams = getBoundParams();
            timeParams = getTimeParams();

            renderUserCountries();
            renderChartUsers();
            renderBrowsers();
            renderClients();

        });

    }, 1000); // Start the zoom-in after one second.

}

function goSAP(timestamp) {
    timestamp = timestamp || 0;
    setTimeout(function () {
        var lookAt = ge.createLookAt('');
        lookAt.set(sap[0], sap[1], 10, ge.ALTITUDE_RELATIVE_TO_GROUND,
            0, 60, 20000);
        ge.getView().setAbstractView(lookAt);
    }, timestamp); // Start the zoom-in after one second.
}

function showSun() {
    ge.getSun().setVisibility(true);
}

function hideSun() {
    ge.getSun().setVisibility(false);
}

function setPlaceMark(markName, iconURL, x, y, scale) {
// Create the placemark.
    var placemark = ge.createPlacemark('');
    placemark.setName(markName);

// Define a custom icon.
    var icon = ge.createIcon('');
    icon.setHref(iconURL);
    var style = ge.createStyle('');
    style.getIconStyle().setIcon(icon);
    style.getIconStyle().setScale(scale);
    placemark.setStyleSelector(style);


// Set the placemark's location.
    var point = ge.createPoint('');
    point.setLatitude(x);
    point.setLongitude(y);
    placemark.setGeometry(point);

// Add the placemark to Earth.
    ge.getFeatures().appendChild(placemark);
    clients.push(placemark);
}

function removePlacemarks() {
    //var kmlObjectList = ge.getFeatures().getChildNodes();
    console.log(clients.length);
    for (var i = 0; i < clients.length; i++) {
        console.log("Delete ",clients[i]);
        ge.getFeatures().removeChild(clients[i]);
    }
    clients = [];
}

function addButton(caption, clickHandler, containerId, className) {
    var btn = document.createElement('input');
    btn.type = 'button';
    btn.value = caption;
    btn.className = ['navigation', className].join(' ');

    if (btn.attachEvent)
        btn.attachEvent('onclick', clickHandler);
    else
        btn.addEventListener('click', clickHandler, false);

    document.getElementById(containerId).appendChild(btn);
}

function goToEarth() {
    ge.getWindow().setVisibility(true);
    ge.getOptions().setAtmosphereVisibility(false);

    showEarth();
    visAuto();
    showSun();
    setPlaceMark("SAP, Ra'anana", 'http://dl.dropbox.com/u/9268245/SAP_icon.png', sap[0], sap[1], 3.0);

}

function getBounds() {
    var globeBounds = ge.getView().getViewportGlobeBounds();

    return {
        north: globeBounds.getNorth(),
        east: globeBounds.getEast(),
        south: globeBounds.getSouth(),
        west: globeBounds.getWest()
    }
}

function getTimeParams() {
    return 't0=&t1=';
}

function getBoundParams() {
    var bounds = getBounds();
    return 'north=' + bounds.north + '&east=' + bounds.east + '&south=' + bounds.south + '&west=' + bounds.west;
}

function goTo(name) {
    var geocodeLocation = name;

    var geocoder = new google.maps.ClientGeocoder();
    geocoder.getLatLng(geocodeLocation, function (point) {
        if (point) {
            var lookAt = ge.createLookAt('');
            lookAt.set(point.y, point.x, 30000, ge.ALTITUDE_RELATIVE_TO_GROUND, 0, 0, 920401);
            ge.getView().setAbstractView(lookAt);

            var country = geocoder.ca.ca[name.toLowerCase()].Placemark[0].AddressDetails.Country.CountryNameCode;
            setPlaceMark(name, 'http://dl.dropbox.com/u/9268245/flags/' + country + '.png', point.y, point.x, 0.8);

        }
    });

}

function getUserIconURL(avgSpeed) {
    var userIconURL = "http://t3.gstatic.com/images?q=tbn:ANd9GcSR6J1ZWF2CorpjoMl2QM8FBfFLlmjf7a0UthO3g5Cl5f76gGrEpWYh-A";
    if(avgSpeed > 0 && avgSpeed <= 5) {
        userIconURL = 'http://dl.dropbox.com/u/9268245/red_monster.png';
    }else if(avgSpeed > 5 && avgSpeed <= 10) {
        userIconURL = 'http://dl.dropbox.com/u/9268245/yellow_monster.png';
    }else if(avgSpeed > 10 && avgSpeed <= 20) {
        userIconURL = 'http://dl.dropbox.com/u/9268245/green_monster.png';
    }else if(avgSpeed >= 20) {
        userIconURL = 'http://dl.dropbox.com/u/9268245/BOBA.png';
    }
    return userIconURL;
}

function renderClients() {
    jQuery.ajax({
        url: 'http://10.26.181.181:8080/labs/API/getUsers?' + timeParams + '&' + boundParams + '&callback=?',
        async: false,
        contentType: "application/json",
        dataType: 'jsonp',
        type: 'GET'
    }).done(function (data, type, xhr) {

            removePlacemarks();

            var fake = [
                {
                    name: 'test1',
                    lon: 32.1,
                    lat: 35.1,
                    avgSpeed: 1
                },
                {
                    name: 'test2',
                    lon: 32.1,
                    lat: 35.3,
                    avgSpeed: 10
                },
                {
                    name: 'test3',
                    lon: 32.1,
                    lat: 35.5,
                    avgSpeed: 2
                },
                {
                    name: 'test4',
                    lon: 32.1,
                    lat: 35.7,
                    avgSpeed: 5
                },
                {
                    name: 'test5',
                    lon: 32.1,
                    lat: 35.9,
                    avgSpeed: 7
                },
                {
                    name: 'test6',
                    lon: 32.1,
                    lat: 36.1,
                    avgSpeed: 3
                },
                {
                    name: 'test7',
                    lon: 32.1,
                    lat: 39.3,
                    avgSpeed: 7
                },
                {
                    name: 'BOBA',
                    lon: 32.5,
                    lat: 35.3,
                    avgSpeed: 100
                }
            ];

            for(var i=0; i<fake.length; i+=1) {
                setPlaceMark(fake[i].name, getUserIconURL(fake[i].avgSpeed), fake[i].lon, fake[i].lat, 1.0);
            }


    }).fail(function () {
            console.log('fail', arguments)
    });

}

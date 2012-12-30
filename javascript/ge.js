var ge, placemark,
    sap = [32.1966, 34.88436],
    target = 'moon',
    boundParams, timeParams,
    clients = [],
    stillRendering = false,
    eventEnd = false,
    rotate,
    initialTimestamp = Number(new Date('Thu Dec 26 2012 12:46:50 GMT+0200 (IST)')),
    rotateEarthParams = [0, 0, 16240001],
    us = true,
    russia = true,
    israel = true;


Number.prototype.padLeft = function (base, chr) {
    var len = (String(base || 10).length - String(this).length) + 1;
    return len > 0 ? new Array(len).join(chr || '0') + this : this;
};

function init() {
    showPlanet('earth');
}

function initCallback(instance) {
    $('#map3d').css({
        visibility: 'hidden'
    });

    ge = instance;

    addButton('Earth', goToEarth, 'buttons');
    addButton('SAP', goSAP, 'buttons');
    addButton('Show', showBorders, 'buttons');
//    addButton('Hide', hideBorders, 'buttons');
    addButton('Play', play, 'buttons');
//    addButton('Stop', stop, 'buttons');
//    addButton('Clear', removePlacemarks, 'buttons');

    showSky();

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

function showEarth(x, y, range) {

    x = typeof(x) === 'undefined' ? sap[0] : x;
    y = typeof(y) === 'undefined' ? sap[1] : y;

    range = typeof(range) === 'undefined' ? 162401 : range;

    removeCover();
    ge.getOptions().setMapType(ge.MAP_TYPE_EARTH);
    setTimeout(function () {
        var oldFlyToSpeed = ge.getOptions().getFlyToSpeed();
        ge.getOptions().setFlyToSpeed(.2);  // Slow down the camera flyTo speed.
        var lookAt = ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND);
        // latitude, longitude, altitude, altitudeMode, heading, tilt, range
        lookAt.set(x, y, 0,
            ge.ALTITUDE_RELATIVE_TO_GROUND, 0, 0, range);
        ge.getView().setAbstractView(lookAt);
        ge.getOptions().setFlyToSpeed(oldFlyToSpeed);

        if (!eventEnd) {
            google.earth.addEventListener(ge.getView(), 'viewchangeend', function (evt) {
                updateEarth();
                eventEnd = true;
            });
        }

    }, 1000); // Start the zoom-in after one second.

}

function updateEarth() {
    boundParams = getBoundParams();
    timeParams = getTimeParams();

    renderUserCountries();
    renderChartUsers();
    renderBrowsers();
    renderClients();
    rendeDoms();
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

function setPlaceMark(markName, iconURL, x, y, scale, sticky) {
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
    if (!sticky) {
        clients.push(placemark);
    }
}

function removePlacemarks() {
    var i = 0, l = clients.length;
    for (i; i < l; i++) {
        //var outOfBaou
//        if (outOfBound) {
        ge.getFeatures().removeChild(clients[i]);
//        }
    }
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
//    showSun();
    setPlaceMark("SAP, Ra'anana", 'http://tlvm60245615a/log_service/images/SAP_icon.png', sap[0], sap[1], 3.0, true);

}

function getBounds() {
    var globeBounds = ge.getView().getViewportGlobeBounds(),
        delta = 1;

    return {
        north: globeBounds.getNorth() * delta,
        east: globeBounds.getEast() * delta,
        south: globeBounds.getSouth() * delta,
        west: globeBounds.getWest() * delta
    }
}

function getTimeParams() {

    var t = new Date(initialTimestamp),
        datetime = [
            t.getFullYear(),
            (t.getMonth() + 1).padLeft(),
            t.getDate().padLeft(),
            t.getHours().padLeft(),
            t.getMinutes().padLeft()
        ];

    var t1 = new Date(initialTimestamp + 6 * 60 * 60 * 1000),
        datetime1 = [
            t1.getFullYear(),
            (t1.getMonth() + 1).padLeft(),
            t1.getDate().padLeft(),
            t1.getHours().padLeft(),
            t1.getMinutes().padLeft()
        ];

    $('#time').text(t);

    if (t.getDate() === 27 && t.getHours() > 0 && t.getHours() < 6) {
        if (us)
            addNote('United States', 'us', 'off', 'United States', 3420401);
        us = false;
    }

    if (t.getDate() === 27 && t.getHours() > 8 && t.getHours() < 10) {
        if (russia) {
            initialTimestamp = 1356702410000;
            addNote('Russian Federation', 'ru', 'slow', 'Moscow', 220401);
        }
        russia = false;
    }

    if (t.getDate() === 28 && t.getHours() > 13 && t.getHours() < 24) {
        if (israel) {
            initialTimestamp = 1356788810000;
            addNote('Israel', 'IL', 'peak', 'Israel', 920401);
        }
        israel = false;
    }

    return 't0=' + datetime.join('') + '&t1=' + datetime1.join('');
}

function getBoundParams() {
    var bounds = getBounds();
    return 'north=' + bounds.north + '&east=' + bounds.east + '&south=' + bounds.south + '&west=' + bounds.west;
}

function goTo(name, range) {

    stop();

    range = range || 920401;

    var geocodeLocation = name;

    var geocoder = new google.maps.ClientGeocoder();
    geocoder.getLatLng(geocodeLocation, function (point) {
        if (point) {
            var lookAt = ge.createLookAt('');
            lookAt.set(point.y, point.x, 30000, ge.ALTITUDE_RELATIVE_TO_GROUND, 0, 0, range);
            ge.getView().setAbstractView(lookAt);

            var country = geocoder.ca.ca[name.toLowerCase()].Placemark[0].AddressDetails.Country.CountryNameCode;
            setPlaceMark(name, 'http://tlvm60245615a/log_service/images/flags/' + country + '.png', point.y, point.x, 0.8, false);

        }
    });

}

function getUserIconURL(avgTime) {

    var img = [
        'evgeny-himmelreich.jpg',
        'BOBA.png',
        'soshin.jpg',
        'kravcheg.jpg'
    ];

    var userIconURL = "";
    if (avgTime >= 0 && avgTime <= 50) {
        userIconURL = 'http://tlvm60245615a/log_service/images/green_monster.png';
    } else if (avgTime > 50 && avgTime <= 200) {
        userIconURL = 'http://tlvm60245615a/log_service/images/yellow_monster.png';
    } else if (avgTime > 200 && avgTime <= 700) {
//        userIconURL = 'http://dl.dropbox.com/u/9268245/red_monster.png';
        userIconURL = 'http://tlvm60245615a/log_service/images/red_monster.png';
    } else if (avgTime > 700) {
        var index = Math.floor((Math.random() * 4));
        index = index > 3 ? 3 : index;

        userIconURL = 'http://tlvm60245615a/log_service/images/' + img[index];
    }
    return userIconURL;
}

function renderClients() {
//     return false
    if (stillRendering) {
        return false;
    }

    var speed = 0;

    jQuery.ajax({
        url: 'http://10.26.181.181:8080/labs/API/getUsers?' + timeParams + '&' + boundParams + '&callback=?',
        async: false,
        contentType: "application/json",
        dataType: 'jsonp',
        type: 'GET',
        timeout: 30000
    }).done(function (data, type, xhr) {

            stillRendering = true;

            console.log(data);

            var fake = data;

            for (var i = 0; i < fake.length; i += 1) {
                setPlaceMark(fake[i].name, getUserIconURL(fake[i].avgSpeed), fake[i].lon, fake[i].lat, 1.0, false);
                speed += fake[i].avgSpeed;
            }

            stillRendering = false;

            var fakeSpeed = (speed / fake.length).toFixed(3);
            fakeSpeed = isNaN(fakeSpeed) ? 'Loading...' : fakeSpeed;

            $('#loading_time .count').text(fakeSpeed);

        }).fail(function () {
            console.log('fail', arguments)
        });

}

function play() {
    stop();
    rotateEarth()
}

function stop() {
    rotate = window.clearInterval(rotate);
}

function rotateEarth() {
    showEarth(rotateEarthParams[0], rotateEarthParams[1], rotateEarthParams[2]);

    var i = 0;
    var x = 30,
        y,
        step = 10,     //rotation frequency
        greed = 20,    //step size in degrees
        numSteps = 360 / greed,
        milliSecInStep = (24 / numSteps) * 60 * 60 * 1000;

    rotateEarthParams[2] = 5024001;

    rotate = window.setInterval(function () {

        console.log("I=" + i);
        if (Math.abs(i) > 110) {
            console.log("jumping long step...");
            i += 4 * greed;
            initialTimestamp += 4 * milliSecInStep;
        }
        else {
            i += greed;
            initialTimestamp += milliSecInStep;
        }

        if (i >= 360) i = 0;

        if (i > 0 && i <= 180) {
            y = i;
        } else {
            y = (180 - Math.abs(180 - i)) * -1;
        }


        rotateEarthParams[0] = x;
        rotateEarthParams[1] = y;


        showEarth(x, y, rotateEarthParams[2]);
//        removePlacemarks();

//        updateEarth();

    }, step * 1000);
}



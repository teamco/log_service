var ge, placemark,
    sap = [32.1966, 34.88436];

function init() {
    google.earth.createInstance('map3d', initCallback, failureCallback);
}

function initCallback(instance) {
    $('#map3d').css({
        visibility: 'hidden'
    });

    ge = instance;

    goSAPBtn();
    showSky();

    setTimeout(function () {
        ge.getWindow().setVisibility(true);
        showEarth();
        visAuto();
        showSun();
        goSAP(6000);
        setPlaceMark();
    }, 15000);


}

function failureCallback(errorCode) {
    console.log(errorCode);
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
        $('#cover').fadeOut(1500, function () {
        });
        $('#map3d').css({
            visibility: 'visible'
        });
        // Zoom in on a nebula.
        var oldFlyToSpeed = ge.getOptions().getFlyToSpeed();
        ge.getOptions().setFlyToSpeed(.2);  // Slow down the camera flyTo speed.
        var lookAt = ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND);
        lookAt.set(41.28509187215, -169.2448684551622, 0,
            ge.ALTITUDE_RELATIVE_TO_GROUND, 262.87, 0, 162401);
        ge.getView().setAbstractView(lookAt);
        ge.getOptions().setFlyToSpeed(oldFlyToSpeed);
    }, 1000); // Start the zoom-in after one second.

    $('#band-aid').fadeIn();
}

function showEarth() {
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

function setPlaceMark() {
// Create the placemark.
    var placemark = ge.createPlacemark('');
    placemark.setName("SAP, Ra'anana");

// Define a custom icon.
    var icon = ge.createIcon('');
    icon.setHref('http://www.haironfirepm.com/wp-content/uploads/2012/08/SAP_icon.png');
    var style = ge.createStyle('');
    style.getIconStyle().setIcon(icon);
    style.getIconStyle().setScale(5.0);
    placemark.setStyleSelector(style);

// Set the placemark's location.
    var point = ge.createPoint('');
    point.setLatitude(sap[0]);
    point.setLongitude(sap[1]);
    placemark.setGeometry(point);

// Add the placemark to Earth.
    ge.getFeatures().appendChild(placemark);
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

function goSAPBtn() {
    addButton('Fly to SAP', goSAP, 'right', 'home')
}
setTimeout(function () {
    document.getElementById('splash-container').classList.add('hide');

    
    setTimeout(function () {
        document.getElementById('splash-container').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
    }, 1000);
}, 3000);

window.addEventListener('load', function() {
    document.getElementById('permissionSnackbar').style.display = 'block';
});

document.getElementById('closeSnackbarBtn').addEventListener('click', function() {
    document.getElementById('permissionSnackbar').style.display = 'none';
});

const currentGeoLocation = document.getElementById("closeSnackbarBtn");

currentGeoLocation.onclick = function() {
    var startPos;
    var geoOptions = {
        timeout: 10 * 1000
    };

    let geoSuccess = function (position) {
        // Do magic with location
        startPos = position;
        const latitude = startPos.coords.latitude;
        const longitude = startPos.coords.longitude;
        console.log(latitude, longitude);
    };
    let geoError = function (error) {
        console.log('Error occurred. Error code: ' + error.code);
        // error.code can be:
        //   0: unknown error
        //   1: permission denied
        //   2: position unavailable (error response from location provider)
        //   3: timed out
    };

    navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
};
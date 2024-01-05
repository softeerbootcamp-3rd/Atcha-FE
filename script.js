function splashPage() {
    console.log("asdsadsadsad");
    setTimeout(function () {
        document.getElementById('splash-container').classList.add('hide');
    
        
        setTimeout(function () {
            document.getElementById('splash-container').style.display = 'none';
            document.getElementById('main-content').style.display = 'block';
        }, 1000);
    }, 1500);
}

function snackBar() {
    window.addEventListener('load', function() {
        document.getElementById('permissionSnackbar').style.display = 'block';
    });
    
    document.getElementById('closeSnackbarBtn').addEventListener('click', function() {
        document.getElementById('permissionSnackbar').style.display = 'none';
    });
}

function getPosition() {
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
}

document.getElementById('goToList').addEventListener('click', function() {
    // Redirect to list.html when [목록] is clicked
    window.location.href = 'list.html';
});

document.getElementById('goToList').addEventListener('click', function() {
    // Redirect to list.html when [목록] is clicked
    window.location.href = 'list.html';
});

document.getElementById('searchBtn').addEventListener('click', function() {
    performSearch();
});

function performSearch() {
    // Get the value entered in the search input
    const searchInputValue = document.getElementById('searchInput').value;

    if (searchInputValue.trim() !== '') {
        // Redirect to search.html with the search query as a parameter
        window.location.href = `search.html?q=${encodeURIComponent(searchInputValue)}`;
    }
}
function main() {
    splashPage();
    snackBar();
    getPosition();
}

main();
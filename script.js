document.getElementById('goToList').addEventListener('click', function() {
    // Redirect to list.html when [목록] is clicked
    window.location.href = 'list.html';
});

document.getElementById('searchInput').addEventListener('keydown', function(event) {
    // Check if the pressed key is Enter
    if (event.key === 'Enter') {
        performSearch();
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const toggleButton = document.getElementById('toggleButton');
    const list = document.getElementById('list');

    toggleButton.addEventListener('click', function () {
        // 리스트를 토글하여 나타내거나 숨김
        if (list.style.display === 'none') {
            list.style.display = 'block';
            toggleButton.innerHTML = '리스트 숨기기 ▼';
        } else {
            list.style.display = 'none';
            toggleButton.innerHTML = '리스트 토글 ▶';
        }
    });
});


function splashPage() {
    setTimeout(function () {
        document.getElementById('splash-container').classList.add('hide');
        
        setTimeout(function () {
            document.getElementById('splash-container').style.display = 'none';
            document.getElementById('main-content').style.display = 'block';
        }, 1000);
    }, 1500);
}

function splashEffect(){
    document.addEventListener('DOMContentLoaded', function() {
        // Check if the splash screen should be displayed
        const splashScreenDisplayed = localStorage.getItem('splashScreenDisplayed');
        console.log(splashScreenDisplayed);
        if (!splashScreenDisplayed) {
            // Show the splash screen
            splashPage();
            // Set a flag to indicate that the splash screen has been displayed
            localStorage.setItem('splashScreenDisplayed', 'true');
        }else{
            document.getElementById('splash-container').style.display = 'none';
            document.getElementById('main-content').style.display = 'block';
        }

    });
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
    const currentGeoLocation = document.getElementById("camera");

    currentGeoLocation.onclick = function() {
        let geoOptions = {
            timeout: 10 * 1000
        };

        let geoSuccess = function (position) {
            // Do magic with location
            const positionObj = {
                latitude : position.coords.latitude,
                longitude : position.coords.longitude
            }
            console.log(positionObj);
        };

        // error.code can be:
            //   0: unknown error
            //   1: permission denied
            //   2: position unavailable (error response from location provider)
            //   3: timed out
        let geoError = function (error) {
            console.log('Error occurred. Error code: ' + error.code);
        };
        navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
    };
}

function performSearch() {
    // Get the value entered in the search input
    const searchInputValue = document.getElementById('searchInput').value;

    if (searchInputValue.trim() !== '') {
        // Redirect to search.html with the search query as a parameter
        window.location.href = `search.html?q=${encodeURIComponent(searchInputValue)}`;
    }
}

function loadImage() {
    let camera = document.getElementById('camera');
    let frame = document.getElementById('frame');

    camera.addEventListener('change', function(e) {
        let file = e.target.files[0];
        // Do something with the image file.
        frame.src = URL.createObjectURL(file);
    });
}

function main() {
    // localStorage.clear();
    splashEffect();
    snackBar();
    getPosition();
    loadImage();
}

main();
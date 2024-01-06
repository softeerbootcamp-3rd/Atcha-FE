document.addEventListener('DOMContentLoaded', function () {
    const toggleButton = document.getElementById('toggleButton');
    const list = document.getElementById('list');

    toggleButton.addEventListener('click', function () {
        // 리스트를 토글하여 나타내거나 숨김
        if (list.style.display === 'none') {
            list.style.display = 'block';
            toggleButton.innerHTML = '주차정보 ▼';
        } else {
            list.style.display = 'none';
            toggleButton.innerHTML = '주차정보 ▶';
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
        const notificationGranted = localStorage.getItem('notificationGranted');
        if(!notificationGranted) {
            document.getElementById('permissionSnackbar').style.display = 'block';
        } else {
            document.getElementById('permissionSnackbar').style.display = 'none';
        }
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

        let geoSuccess = async function (position) {
            // Do magic with location
            const positionObj = {
                latitude : position.coords.latitude,
                longitude : position.coords.longitude
            }

            await fetch('/location/set', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: "1",
                    latitude: positionObj.latitude,
                    longitude: positionObj.longitude,
                })
            })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error('Fetch error:', error));

            console.log(response);
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

// function checkGeolocationPermission() {
//     if ("geolocation" in navigator) {
//         navigator.permissions.query({ name: 'geolocation' })
//             .then(permissionStatus => {
//                 if (permissionStatus.state === 'granted') {
//                     console.log('Geolocation 권한이 허용되었습니다.');
//                     // 권한이 허용된 경우 추가 작업 수행
//                 } else {
//                     console.log('Geolocation 권한이 거부되었거나 사용자가 권한을 허용하지 않았습니다.');
//                 }
//             })
//             .catch(error => console.error('Geolocation API를 사용할 수 없습니다.', error));
//     } else {
//         console.error('Geolocation API를 지원하지 않는 브라우저입니다.');
//     }
// }

// async function checkCameraPermission() {
//     try {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//         console.log('카메라 권한이 허용되었습니다.');
//         // 권한이 허용된 경우 추가 작업 수행

//         // 사용이 끝난 스트림은 해제
//         stream.getTracks().forEach(track => track.stop());
//     } catch (error) {
//         console.error('카메라 권한이 거부되었거나 사용자가 권한을 허용하지 않았습니다.', error);
//     }
// }

function checkNotification() {
    document.getElementById('closeSnackbarBtn').addEventListener('click', function() {
        Notification.requestPermission()
        .then(permission => {
            // 권한 요청이 완료된 후에 실행되는 코드
            console.log('알림 권한 상태:', permission);
            // permission 값은 'granted', 'denied', 'default' 중 하나일 수 있습니다.
            // denied면 그냥 종료해버리는게 나을듯
            const notificationGranted = localStorage.getItem('notificationGranted');
            if(permission === "granted" && !notificationGranted) {
                localStorage.setItem('notificationGranted', 'true');
                console.log(notificationGranted);
            }
        })
        .catch(error => {
            console.log('알림 권한 설정 에러: ', error);
        })
    })
}

async function getParkingInformation(locationName) {
    const queryString = `/home?name=${locationName}`;
    const urlWithQueryString = `/tempUrl/${queryString}`;

    await fetch('urlWithQueryString')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Fetch error:', error));

    const parkingInformation = response.map((x) => x.data);
}

async function getHistoryInformation(id) {
    const queryString = `/home/history/${id}`;
    const urlWithQueryString = `/tempUrl/${queryString}`;

    await fetch(urlWithQueryString)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Fetch error:', error));

  // do something with response to list history value
}

document.getElementById('goToList').addEventListener('click', function() {
    // Redirect to list.html when [목록] is clicked
    window.location.href = 'list.html';
});

document.getElementById('parkingEnd').addEventListener('click', function() {
    // Do something when [주차 종료] is clicked
    window.location.href = 'list.html';
    console.log("parkingEnd clicked!");
});

document.getElementById('searchInput').addEventListener('keydown', function(event) {
    // Check if the pressed key is Enter
    if (event.key === 'Enter') {
        performSearch();
    }
});

function main() {
    splashEffect();
    snackBar();
    getPosition();
    loadImage();
    checkNotification();
}

main();
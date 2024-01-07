// 메인 화면 하단의 주차 정보 출력 관련 기능 
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

// 실행시 처음 스플래쉬 효과 관련 함수
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
        // 맨 처음 접속 했을 때
        if (!splashScreenDisplayed) {
            // Show the splash screen
            splashPage();
            // Set a flag to indicate that the splash screen has been displayed
            localStorage.setItem('splashScreenDisplayed', 'true');
        }else{ // 2번 이상 접속 했을 때 스플래쉬 효과가 나오지 않도록
            document.getElementById('splash-container').style.display = 'none';
            document.getElementById('main-content').style.display = 'block';
        }

    });
}

// 사용자 알람, 위치 권한 요청을 위한 스낵바
function snackBar() {
    window.addEventListener('load', function() {
        const notificationGranted = localStorage.getItem('notificationGranted');
        
        // 알림 권한이 허용되지 않았을 때
        if(!notificationGranted) {
            document.getElementById('permissionSnackbar').style.display = 'block';
        } else { // 알림 권한이 허용 됐을 때
            document.getElementById('permissionSnackbar').style.display = 'none';
        }
    });
    
    document.getElementById('closeSnackbarBtn').addEventListener('click', function() {
        document.getElementById('permissionSnackbar').style.display = 'none';
    });
}

// 사용자의 위도, 경도 값을 가져오는 함수
function getPosition() {
    const currentGeoLocation = document.getElementById("closeSnackbarBtn");

    currentGeoLocation.onclick = function() {
        let geoOptions = {
            timeout: 10 * 1000
        };

        // 위도, 경도 값을 성공적으로 가져왔을 때
        let geoSuccess = async function (position) {
            // Do magic with location
            const positionObj = {
                latitude : position.coords.latitude,
                longitude : position.coords.longitude
            }

            // 서버로 위도, 경도 값 전송 (POST)
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

// 사용자로부터 입력을 받고 쿼리 스트링을 가지고 search.html로 리다이랙션하는 함수
function performSearch() {
    // Get the value entered in the search input
    const searchInputValue = document.getElementById('searchInput').value;

    if (searchInputValue.trim() !== '') {
        // Redirect to search.html with the search query as a parameter
        window.location.href = `search.html?q=${encodeURIComponent(searchInputValue)}`;
    }
}

// 카메라 기능과 사진을 로드하는 기능의 함수
function loadImage() {
    let camera = document.getElementById('camera');
    let frame = document.getElementById('frame');

    camera.addEventListener('change', function(e) {
        let imageId;
        let file = e.target.files[0];
        let formData = new FormData();
        formData.append('image', file);

        // 서버로 이미지 업로드
        fetch('/camera/save', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => { // 이미지 로드
            imageId = data.id;
            frame.src = data.data.imageDataList[1];
        })
        .catch(error => console.error('에러: ', error));
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

// 알림 권한 허용을 요청하고 확인하는 함수
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

// 주차장 관련 정보를 서버로부터 가져오는 함수 (GET)
async function getParkingInformation(locationName) {
    const queryString = `/home?name=${locationName}`;
    const urlWithQueryString = `/tempUrl/${queryString}`;

    await fetch('urlWithQueryString')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Fetch error:', error));

    const parkingInformation = response.map((x) => x.data);
}

// 기록 목록 정보를 서버로부터 가져오는 함수 (GET)
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

// main 함수
function main() {
    splashEffect();
    snackBar();
    getPosition();
    loadImage();
    checkNotification();
}

main();
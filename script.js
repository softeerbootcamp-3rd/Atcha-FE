import { generateModal, closeModal} from "./modal/modal.js";

document.getElementById('btn1').addEventListener('click', function() {
    console.log("1");
    closeModal();
    window.location.href = 'search/search.html';
})

document.getElementById('btn2').addEventListener('click', function() {
    console.log("2");
    const originalText = document.getElementById('location-content').outerHTML;
    const locationName = parseStringBetweenSingleQuotes(originalText);

    console.log(locationName);

    scheduleRequest(locationName);
    getParkingInformation(locationName);
    closeModal();
})

// HTML에서 ' ' 사이의 문자열을 파싱하는 함수
function parseStringBetweenSingleQuotes(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const textContent = doc.body.textContent;
  
    // 정규 표현식을 사용하여 ' ' 사이의 문자열 추출
    const match = textContent.match(/'([^']+)'/);
    if (match) {
      return match[1]; // 매치된 문자열 반환
    } else {
      return null; // 매치되지 않으면 null 반환
    }
  }

// 실행시 처음 스플래쉬 효과 관련 함수
function splashPage() {
    setTimeout(function () {
        document.getElementById('splash-container').classList.add('hide');
        
        setTimeout(function () {
            document.getElementById('splash-container').style.display = 'none';
            document.getElementById('main-content').style.display = 'block';
        }, 1000);
    }, 1900);
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
        console.log("hello")
        generateModal();
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
            // 위도
            const latitude = position.coords.latitude;
            // 경도
            const longitude = position.coords.longitude;

            console.log(latitude, longitude);

            let params = new URLSearchParams();
            params.append('latitude', latitude.toString());
            params.append('longitude', longitude.toString());

            console.log(params.toString());

            // URL과 쿼리 문자열 합치기
            let url = 'http://localhost:8080/location/set/user?' + params.toString();

            // 서버로 위도, 경도 값 전송 (GET)
            await fetch(url)
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
// function performSearch() {
//     // Get the value entered in the search input
//     const searchInputValue = document.getElementById('searchInput').value;

//     if (searchInputValue.trim() !== '') {
//         // Redirect to search.html with the search query as a parameter
//         window.location.href = `search.html?q=${encodeURIComponent(searchInputValue)}`;
//     }
// }

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

// 주차장 관련 정보를 서버로부터 가져오는 함수 (GET) <=========================
export async function getParkingInformation(locationName) {
    const url = `http://localhost:8080/home?name=${locationName}`;

    await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then(data => {
            let ul = document.getElementById('parkingList');
            let fee = data.data.parkingLot.fee;
            let runningTime = data.data.parkingLot.runningTime;
            let discount = data.data.parkingLot.discount;
            var dataArr = {'주차요금':fee, '운영시간':runningTime, '할인정보':discount};

            for (var key in dataArr) {
                const listItem = document.createElement('li');

                const parkingKey = document.createElement('div');
                parkingKey.className = 'parkingKey';
                parkingKey.textContent = key;

                const parkingValue = document.createElement('div');
                parkingValue.className = 'parkingValue';
                parkingValue.textContent = dataArr[key];

                listItem.appendChild(parkingKey);
                listItem.appendChild(parkingValue);

                ul.appendChild(listItem);
            }
        })
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

// 현재의 주차 정보를 가져오는 함수 <====================================
export function scheduleRequest(locationName) {
    async function getNowParkingInfo() {
        const url = `http://localhost:8080/home?name=${locationName}`; // name 변경 필요
        let parkingLotName = document.getElementById('building-location');
        let feeInfo = document.getElementById('fee'); // 파싱 완료된 데이터
        let time = document.getElementById("time");
        let today = new Date();
        let realTime;
        await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(data => {
                // 현재 위치 변경
                parkingLotName.innerHTML = data.data.parkingLot.name;
                feeInfo.innerHTML = data.data.myParkingFee; // 파싱 완료된 데이터

                // 시간 구하기
                let parkingTime = data.data.startTime.split(':');
                let parkingHour = parkingTime[0];
                let parkingMinutes = parkingTime[1];
                let realMinutes =  today.getMinutes();

                if (realMinutes - parkingMinutes < 0) {
                    parkingHour -= 1;
                    realMinutes += 60;
                }

                realTime = today.getHours() - parkingHour + '시간 ' + (realMinutes - parkingMinutes) + '분';
                time.innerHTML = realTime;

            })
    }

    getNowParkingInfo().then(() => {
        setTimeout(() => scheduleRequest(locationName), 6000);
    });
};

// 시간을 변경해주는 함수 로직변경으로 사용x
let hours = 0;
let minutes = 0;
let seconds = 0;
let timer;
let feeInfo

function startTimer() {
    timer = setInterval(() => {
        seconds++;
        if (seconds >= 60) {
            minutes++;
            seconds = 0;
        }
        if (minutes >= 60) {
            hours++;
            minutes = 0;
        }
        document.getElementById('time').innerHTML = hours + "시간 " + minutes + "분 ";
    }, 1000);
}

// 파일 입력에 이벤트 리스너 추가
document.getElementById('camera').addEventListener('change', (event) => {
    // 파일이 선택되었는지 확인합니다.
    if (event.target.files && event.target.files.length > 0) {
        // 타이머가 이미 실행 중이라면 초기화합니다.
        if (timer) {
            clearInterval(timer);
            hours = 0;
            minutes = 0;
            seconds = 0;
        }
        // 타이머를 시작합니다.
    }
});

document.getElementById('goToList').addEventListener('click', function() {
    // Redirect to list.html when [목록] is clicked
    window.location.href = 'list/list.html';
});

document.getElementById('parkingEnd').addEventListener('click', function() {
    // Do something when [주차 종료] is clicked
    window.location.href = 'list.html';
    console.log("parkingEnd clicked!");
});

document.getElementById('searchArea').addEventListener('click', function () {
    // Redirect to search.html when searchContent is clicked
    window.location.href = 'search.html';
    console.log('searchArea clicked!');
})

// main 함수
function main() {
    splashEffect();
    snackBar();
    // getPosition();
    loadImage();
    // getParkingInformation('locationName'); // modal에서 사용
    // scheduleRequest('locationName'); // modal에서 사용
    checkNotification();
}

main();
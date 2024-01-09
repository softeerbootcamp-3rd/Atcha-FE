import { generateModal, closeModal} from "./modal/modal.js";

(function () {
    const key = localStorage.getItem('locationKey');
    if(!key) {
        return ;
    } else {
        scheduleRequest(key);
        getParkingInformation(key);
    }
})();

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

    let locationKey = localStorage.getItem('locationKey');
    console.log(`locationKey : ${locationKey}`);
    if(!locationKey) {
        localStorage.setItem('locationKey', locationName);
        locationKey = localStorage.getItem('locationKey');
    }

    console.log(`locationKey : ${locationKey}`);
    scheduleRequest(locationKey);
    getParkingInformation(locationKey);
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
    }, 2200);
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
        const snackbar = this.document.getElementById('permissionSnackbar');
        // 알림 권한이 허용되지 않았을 때
        if(!notificationGranted) {
            // Snackbar가 아래에서 위로 올라오는 애니메이션 클래스 추가
            snackbar.classList.add('slide-up');
            snackbar.classList.add('show');
            document.getElementById('permissionSnackbar').style.display = 'block';
        } else { // 알림 권한이 허용 됐을 때
            document.getElementById('permissionSnackbar').style.display = 'none';
        }
        document.getElementById('closeSnackbarBtn').addEventListener('click', function() {
            snackbar.classList.remove('slide-up');
            document.getElementById('permissionSnackbar').style.display = 'none';
            generateModal();
        });
    });
}

// 카메라 기능과 사진을 로드하는 기능의 함수
function loadImage() {
    let camera = document.getElementById('camera');
    let frame = document.getElementById('frame');
    let cameraArea = document.getElementById('cameraArea');

    camera.addEventListener('change', async function(e) {
        let file = e.target.files[0];
        let formData = new FormData();
        formData.append('image', file);

        // 서버로 이미지 업로드 219.255.1.253:8080
        // const response = await fetch('http://localhost:8080/camera/save', {
        const response = await fetch('//219.255.1.253:8080/camera/save', {
            headers: 'multipart/form-data',
            method: 'POST',
            body: formData
        })
        
        const jsonData = response.json();
        const imageId = jsonData.data.imageDataList['id'];
        const imageLink = jsonData.data.imageDataList['imageLink'];

        cameraArea.style.display = none;
        frame.src = imageLink;
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

// 주차장 관련 정보를 서버로부터 가져오는 함수 (GET)
export async function getParkingInformation(locationName) {
    localStorage.setItem("locationKey", locationName);
    // const url = `http://localhost:8080/home?name=${locationName}`;
    const url = `//219.255.1.253:8080/home?name=${locationName}`;

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

// 현재의 주차 정보를 가져오는 함수
export function scheduleRequest(locationName) {
    async function getNowParkingInfo() {
        // const url = `http://localhost:8080/home?name=${locationName}`; // name 변경 필요
        const url = `//219.255.1.253:8080/home?name=${locationName}`; // name 변경 필요
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

// localStorage 세팅
function setStorage() {
    console.log("setting storage");
    localStorage.setItem("user", "test");
    localStorage.setItem("userId", 1);
}

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

document.getElementById('parkingEnd').addEventListener('click', async function() {
    // Do something when [주차 종료] is clicked

    let formData = {
        "name" : "현대백화점 무역센터점",
        "imageId" : 0,
        "content" : "메모",
        "paidFee" : "1,000 원",
        "parkingTime" : "1시간 24분"
    }

    let jsonData = JSON.stringify(formData);

    // 요청 url 생성
    const reqUrl = `//219.255.1.253:8080/home/exit`;
    // const reqUrl = `http://localhost:8080/home/exit`;

    // api 요청
    const response = await fetch(reqUrl, {
        method : "POST",
        headers : {
            "Content-Type" : "application/json",
        },
        body : jsonData
    })
    .then(res => {return res.json()});
    // console.log(response);

    window.location.href = 'list/list.html';
    console.log("parkingEnd clicked!");
});

document.getElementById('searchArea').addEventListener('click', function () {
    // Redirect to search.html when searchContent is clicked
    window.location.href = 'search/search.html';
    console.log('searchArea clicked!');
})

document.getElementById('parkingMain').addEventListener('click', function () {
    window.location.href = 'parkingInfo/parkingInfo.html';
})

// main 함수
function main() {
    setStorage();
    splashEffect();
    snackBar();
    loadImage();
    checkNotification();
    console.log("user : " + localStorage.getItem("user"));
    console.log("userId : " + localStorage.getItem("userId"));
    console.log("locationKey : " + localStorage.getItem("locationKey"));
}

main();
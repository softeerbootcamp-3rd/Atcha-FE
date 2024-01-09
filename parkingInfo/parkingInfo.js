import { SERVER_URL } from '../constants.js';

const checkHasIncode = keyword => {
    const check_kor = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/; // 한글인지 식별해주기 위한 정규표현식
  
    if (keyword.match(check_kor)) {
      const encodeKeyword = encodeURI(keyword); // 한글 인코딩
      return encodeKeyword;
    } else {
      return keyword;
    }
  };

async function loadParkingInfo(name) {
    // 요청 url 생성
    // const reqUrl = `http://localhost:8080/home?name=${checkHasIncode(name)}`;
    const reqUrl = `${SERVER_URL}/home?name=${checkHasIncode(name)}`;

    // api 요청
    const response = await fetch(reqUrl, {
        method : "GET",
        headers : {
            "Content-Type" : "application/json",
        }
    })
    .then(res => {return res.json()});

    // 주차장 이름 설정
    document.getElementById('parkinglot-name').textContent = response.data.parkingLot.name;

    // 요금 정보 추가
    const feeDiv = document.getElementById('fee');
    const fees = response.data.parkingLot.fee.split("\n ");
    for (let fee of fees) {
      var child = document.createElement("p");
      child.textContent = fee;
      feeDiv.appendChild(child);
    }

    // 할인 정보 추가
    const discountDiv = document.getElementById('discount');
    const discounts = response.data.parkingLot.discount.split("\n ");
    for (let discount of discounts) {
      var child = document.createElement("p");
      child.textContent = discount;
      discountDiv.appendChild(child);      
    }

    // 운영 시간 정보 추가
    const runningTimeDiv = document.getElementById('runningTime');
    const runningTimes = response.data.parkingLot.runningTime.split("\n ");
    for (let runningTime of runningTimes) {
      var child = document.createElement("p");
      child.textContent = runningTime;
      runningTimeDiv.appendChild(child);      
    }
};

document.getElementById("goToMain").addEventListener('click', function () {
  if (localStorage.getItem("parkingLotKey")) {
    localStorage.removeItem("parkingLotKey");
    window.location.href = "../history/history.html";
  } else {
    window.location.href = "../main.html";
  }
});

function main() {
  if (localStorage.getItem("parkingLotKey")) {
    loadParkingInfo(localStorage.getItem("parkingLotKey"));
  } else {
    loadParkingInfo(localStorage.getItem("locationKey"));
  }
    // loadParkingInfo("코엑스");
};

main();
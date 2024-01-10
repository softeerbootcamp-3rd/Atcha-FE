import { SERVER_URL } from '../constants.js';

document.getElementById('main-content').style.display = 'block';

document.getElementById('goToList').addEventListener('click', function () {
    window.location.href = '../list/list.html'
})

document.getElementById('memo').setAttribute("disabled", "");

document.getElementById('parkingMain').addEventListener('click', function (event) {
    localStorage.setItem('parkingLotKey', document.getElementById('building-location').textContent);
    window.location.href = '../parkingInfo/parkingInfo.html';
})

async function loadHistory() {
    // 요청 url 생성
    const reqUrl = `${SERVER_URL}/home/history/detail/${localStorage.getItem("historyId")}`;

    // api 요청
    const response = await fetch(reqUrl, {
        method : "GET",
        headers : {
            "Content-Type" : "application/json",
        }
    })
    .then(res => {return res.json()});
    console.log(response);
    console.log(response.data.link);

    document.getElementById('history-date').textContent = response.data.parkingDate;
    document.getElementById('building-location').textContent = response.data.parkingLot.name;
    document.getElementById('time').textContent = response.data.parkingTime;
    document.getElementById('fee').textContent = response.data.paidFee;
    document.getElementById('memo').textContent = response.data.content;

    cameraArea.style.display = 'none';

    const frame = document.getElementById('frame');
    frame.src = response.data.link;

    let ul = document.getElementById('parkingList');
    let fee = response.data.parkingLot.fee.split("|")[0];
    let runningTime = response.data.parkingLot.runningTime.split("|")[0];
    let discount = response.data.parkingLot.discount.split("\n")[0];
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
}

function main() {
    console.log(localStorage.getItem("historyId"));
    loadHistory();
}

main();
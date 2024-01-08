document.addEventListener('DOMContentLoaded', function () {
    const scrollContainer = document.getElementById('scrollContainer');
    const list = document.getElementById('list');

    // 가상의 아이템을 생성하여 리스트에 추가
    // for (let i = 1; i <= 50; i++) {
    //     const listItem = document.createElement('li');
    //     listItem.className = 'listItem';
    //     listItem.textContent = '리스트 아이템 ' + i;
    //     list.appendChild(listItem);
    // }

    // 편집 모드 여부를 나타내는 변수
    let isEditMode = false;

    // 편집 버튼 클릭 이벤트 처리
    document.getElementById('edit').addEventListener('click', function() {
        isEditMode = !isEditMode;

        // 편집 모드인 경우, 각 리스트 아이템에 클릭 이벤트 추가
        if (isEditMode) {
            list.querySelectorAll('.listItem').forEach(item => {
                item.addEventListener('click', handleListItemClick);
            });
        } else {
            // 편집 모드가 아닌 경우, 각 리스트 아이템에서 클릭 이벤트 제거
            list.querySelectorAll('.listItem').forEach(item => {
                item.removeEventListener('click', handleListItemClick);
            });
        }
    });

    function handleListItemClick(event) {
        // 편집 모드에서는 클릭된 리스트 아이템 삭제
        if (isEditMode) {
            event.currentTarget.remove();
        }
    }

    // 스크롤 이벤트 처리
    // scrollContainer.addEventListener('scroll', function () {
    //     // 스크롤이 끝까지 도달하면 새로운 아이템을 리스트에 추가
    //     if (scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight) {
    //         for (let i = 51; i <= 100; i++) {
    //             const listItem = document.createElement('li');
    //             listItem.className = 'listItem';
    //             listItem.textContent = '리스트 아이템 ' + i;
    //             list.appendChild(listItem);
    //         }
    //     }
    // });
});

document.getElementById('goToMain').addEventListener('click', function() {
    // Redirect to list.html when [뒤로가기] is clicked
    window.location.href = 'index.html';
});

document.getElementById('edit').addEventListener('click', function() {
    // Redirect to list.html when [뒤로가기] is clicked
    console.log("Edit!")
});

async function loadHistory(memberId) {
    // 요청 url 생성
    const reqUrl = `http://localhost:8080/home/history/${memberId}`;

    // api 요청
    const response = await fetch(reqUrl, {
        method : "GET",
        headers : {
            "Content-Type" : "application/json",
        }
    })
    .then(res => {return res.json()});
    console.log(response.data.historys);

    const scrollContainer = document.getElementById("scrollContainer");
    for (let data of response.data.historys) {
        const infoBox = document.createElement("div");
        infoBox.classList.add("listBox");
        const log = document.createElement("div");
        
        const timeLog = document.createElement("div");
        timeLog.classList.add("info");
        const parkingLog = document.createElement("div");
        parkingLog.classList.add("info");

        var dateChild = document.createElement("text");
        dateChild.setAttribute("id", "date");
        dateChild.textContent = data.parkingDate;
        timeLog.appendChild(dateChild);

        var timeChild = document.createElement("text");
        timeChild.setAttribute("id", "time");
        timeChild.classList.add("position-right");
        timeChild.textContent = data.parkingTime;
        timeLog.appendChild(timeChild);

        log.appendChild(timeLog);

        var parkingChild = document.createElement("text");
        parkingChild.setAttribute("id", "parkinglot-name");
        parkingChild.textContent = data.parkingName;
        parkingLog.appendChild(parkingChild);

        var feeChild = document.createElement("text");
        feeChild.setAttribute("id", "fee");
        feeChild.classList.add("position-right");
        feeChild.textContent = data.paidFee;
        parkingLog.appendChild(feeChild);

        log.appendChild(parkingLog);
        infoBox.appendChild(log);

        scrollContainer.appendChild(infoBox);
    }
};

function main() {
    loadHistory(1);
};

function selectMapList() {
	
    var map = new naver.maps.Map('map', {
        center: new naver.maps.LatLng(37.3595704, 127.105399),
        zoom: 10
    });
}

main();
selectMapList();
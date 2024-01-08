const scrollContainer = document.getElementById("scrollContainer");
const editButton = document.getElementById("edit");
const deleteButton = document.getElementById("button-delete");

let isEditMode = false;
let deleteList = [];

deleteButton.addEventListener('click', confirmDelete);
document.getElementById('goToMain').addEventListener('click', function() {
    // Redirect to list.html when [뒤로가기] is clicked
    window.location.href = 'index.html';
});

document.getElementById('edit').addEventListener('click', function() {
    // Redirect to list.html when [뒤로가기] is clicked
    console.log("Edit!");
    changeMode();
});

async function confirmDelete() {
    for (let historyId of deleteList) {
        const reqUrl = `http://localhost:8080/home/history/${(historyId)}`;

        // api 요청
        const response = await fetch(reqUrl, {
            method : "DELETE",
            headers : {
                "Content-Type" : "application/json",
            }
        })
    }

    location.reload(true);
}

async function changeMode() {
    isEditMode = !isEditMode;
    deleteButton.classList.toggle("hidden");

    // 편집 모드인 경우, 각 리스트 아이템에 클릭 이벤트 추가
    if (isEditMode) {
        editButton.textContent = "취소";
        scrollContainer.querySelectorAll('label').forEach(item => {
            item.addEventListener('click', handleListItemClick);
            const input = document.createElement("input");
            input.id = "input";
            input.setAttribute("type", "checkbox");
            item.prepend(input);
        });
    } else {
        editButton.textContent = "편집";
        // 편집 모드가 아닌 경우, 각 리스트 아이템에서 클릭 이벤트 제거
        scrollContainer.querySelectorAll('label').forEach(item => {
            item.querySelector("#input").remove();
            item.removeEventListener('click', handleListItemClick);
        });

        deleteList = [];
    }
};

function handleListItemClick(event) {
    if (event.target.tagName !== "INPUT") {
        return;
    }
    // 편집 모드에서는 클릭된 리스트 아이템 삭제
    if (isEditMode) {
        const historyId = event.currentTarget.id;
        const indexToRemove = deleteList.indexOf(historyId);
        if (indexToRemove !== -1) {
            deleteList.splice(indexToRemove, 1);
        } else {
            deleteList.push(event.currentTarget.id);
        }
    }

    // console.log(deleteList);
}

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
    // console.log(response.data.historys);

    for (let data of response.data.historys) {
        const label = document.createElement("label");
        label.id = data.historyId

        const listBox = document.createElement("div");
        // listBox.id = data.historyId;
        listBox.classList.add("listBox");

        const log = document.createElement("div");
        
        const timeLog = document.createElement("div");
        timeLog.classList.add("info");
        
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

        const parkingLog = document.createElement("div");
        parkingLog.classList.add("info");
        
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

        listBox.appendChild(log);

        label.appendChild(listBox);

        scrollContainer.appendChild(label);
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